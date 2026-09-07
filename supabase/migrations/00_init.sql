-- StudioFlow Initial Schema & RLS Policies

-- 1. Organizations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

-- 2. Memberships (Staff/Owner association to orgs - strictly server controlled)
create table public.memberships (
  user_id uuid references auth.users(id) primary key,
  organization_id uuid references public.organizations(id) not null,
  role text not null default 'staff' check (role in ('owner', 'staff', 'instructor')),
  created_at timestamptz not null default now()
);

-- Enable RLS for memberships
alter table public.memberships enable row level security;

-- Policy: Users can only read their own membership row
create policy "read own membership" on public.memberships
  for select using (user_id = auth.uid());

-- Helper Functions for RLS
create or replace function public.get_auth_org_id()
returns uuid as $$
  select organization_id from public.memberships where user_id = auth.uid();
$$ language sql stable security definer;

create or replace function public.is_studio_owner()
returns boolean as $$
  select role = 'owner' from public.memberships where user_id = auth.uid();
$$ language sql stable security definer;

-- 3. Class Types
create table public.class_types (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  name text not null,
  duration_minutes integer not null,
  default_capacity integer not null,
  created_at timestamptz not null default now()
);

alter table public.class_types enable row level security;
create policy "org staff can read class types" on public.class_types
  for select using (org_id = public.get_auth_org_id());
create policy "org owner can manage class types" on public.class_types
  for all using (org_id = public.get_auth_org_id() and public.is_studio_owner());
create policy "public can read class types" on public.class_types
  for select using (true);

-- 4. Instructors
create table public.instructors (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  name text not null,
  pay_rate_cents integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.instructors enable row level security;
create policy "org staff can read instructors" on public.instructors
  for select using (org_id = public.get_auth_org_id());
create policy "org owner can manage instructors" on public.instructors
  for all using (org_id = public.get_auth_org_id() and public.is_studio_owner());
create policy "public can read instructors" on public.instructors
  for select using (true);

-- 5. Class Schedule
create table public.class_schedule (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  class_type_id uuid not null references public.class_types(id),
  instructor_id uuid not null references public.instructors(id),
  starts_at timestamptz not null,
  capacity_override integer,
  location text,
  created_at timestamptz not null default now()
);

alter table public.class_schedule enable row level security;
create policy "org staff can manage class schedule" on public.class_schedule
  for all using (org_id = public.get_auth_org_id());
create policy "public can read class schedule" on public.class_schedule
  for select using (true);

-- 6. Members (End-customers, not auth users by default)
create table public.members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  name text not null,
  phone text,
  email text,
  joined_at timestamptz not null default now()
);

alter table public.members enable row level security;
create policy "org staff can manage members" on public.members
  for all using (org_id = public.get_auth_org_id());

-- 7. Membership Plans
create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id),
  name text not null,
  price_cents integer not null,
  billing_interval text not null, -- 'month', 'year', 'week'
  credits_per_period integer, -- null means unlimited if is_unlimited is true
  is_unlimited boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.membership_plans enable row level security;
create policy "org staff can read plans" on public.membership_plans
  for select using (org_id = public.get_auth_org_id());
create policy "org owner can manage plans" on public.membership_plans
  for all using (org_id = public.get_auth_org_id() and public.is_studio_owner());
create policy "public can read plans" on public.membership_plans
  for select using (true);

-- 8. Member Subscriptions
create table public.member_subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id),
  plan_id uuid not null references public.membership_plans(id),
  status text not null, -- 'active', 'past_due', 'canceled'
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

alter table public.member_subscriptions enable row level security;
create policy "org staff can manage member subscriptions" on public.member_subscriptions
  for all using (
    exists (
      select 1 from public.members
      where id = member_subscriptions.member_id
      and org_id = public.get_auth_org_id()
    )
  );

-- 9. Class Bookings
create table public.class_bookings (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references public.class_schedule(id),
  member_id uuid not null references public.members(id),
  status text not null default 'booked', -- 'booked', 'waitlisted', 'canceled'
  checked_in_at timestamptz,
  credit_used boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.class_bookings enable row level security;
create policy "org staff can manage bookings" on public.class_bookings
  for all using (
    exists (
      select 1 from public.class_schedule
      where id = class_bookings.schedule_id
      and org_id = public.get_auth_org_id()
    )
  );
-- Policy to allow anonymous users to book a class if they are verifying somehow
-- Note: As specified, the public page is unauthenticated. We'll allow inserts but with a security definer function to avoid open RLS inserts.

-- 10. Credit Ledger
create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id),
  delta integer not null, -- positive for credits added, negative for credits used
  reason text not null,
  related_booking_id uuid references public.class_bookings(id),
  created_at timestamptz not null default now()
);

alter table public.credit_ledger enable row level security;
create policy "org staff can read credit ledger" on public.credit_ledger
  for select using (
    exists (
      select 1 from public.members
      where id = credit_ledger.member_id
      and org_id = public.get_auth_org_id()
    )
  );
-- Insert/Update to credit_ledger should strictly be through functions to prevent tampering.

-- 11. Transactional Functions

-- Securely get current member credit balance
create or replace function public.get_member_credit_balance(p_member_id uuid)
returns integer as $$
  select coalesce(sum(delta), 0) from public.credit_ledger where member_id = p_member_id;
$$ language sql stable;

-- Securely book a class with strict capacity enforcement
create or replace function public.book_class_spot(
  p_schedule_id uuid,
  p_member_id uuid,
  p_use_credit boolean
) returns jsonb as $$
declare
  v_capacity integer;
  v_booked_count integer;
  v_waitlisted_count integer;
  v_status text;
  v_booking_id uuid;
begin
  -- Lock the schedule row to prevent concurrent race conditions
  select coalesce(cs.capacity_override, ct.default_capacity)
  into v_capacity
  from public.class_schedule cs
  join public.class_types ct on ct.id = cs.class_type_id
  where cs.id = p_schedule_id
  for update;
  
  if not found then
    return jsonb_build_object('success', false, 'error', 'Schedule not found');
  end if;

  -- Count existing active bookings
  select count(*) into v_booked_count
  from public.class_bookings
  where schedule_id = p_schedule_id and status = 'booked';

  -- Determine if we are booking or waitlisting
  if v_booked_count < v_capacity then
    v_status := 'booked';
  else
    v_status := 'waitlisted';
  end if;
  
  -- Prevent double booking
  if exists (select 1 from public.class_bookings where schedule_id = p_schedule_id and member_id = p_member_id and status in ('booked', 'waitlisted')) then
     return jsonb_build_object('success', false, 'error', 'Member already booked or waitlisted');
  end if;

  -- Check and deduct credit if needed
  if p_use_credit and v_status = 'booked' then
    if public.get_member_credit_balance(p_member_id) < 1 then
      return jsonb_build_object('success', false, 'error', 'Insufficient credits');
    end if;
  end if;

  -- Insert booking
  insert into public.class_bookings (schedule_id, member_id, status, credit_used)
  values (p_schedule_id, p_member_id, v_status, p_use_credit)
  returning id into v_booking_id;

  -- Deduct credit transactionally
  if p_use_credit and v_status = 'booked' then
    insert into public.credit_ledger (member_id, delta, reason, related_booking_id)
    values (p_member_id, -1, 'class_booking', v_booking_id);
  end if;

  return jsonb_build_object('success', true, 'status', v_status, 'booking_id', v_booking_id);
end;
$$ language plpgsql security definer;
