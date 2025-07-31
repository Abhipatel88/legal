-- Test if trigger exists and works
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table, 
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Test if function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check if roles exist
SELECT name FROM public.roles WHERE name IN ('Admin', 'Employee', 'HR Manager');