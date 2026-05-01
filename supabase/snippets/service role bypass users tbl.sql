create policy "service role bypass"
on users
for all
to service_role
using (true)
with check (true);