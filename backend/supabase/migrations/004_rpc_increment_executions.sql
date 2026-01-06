create or replace function public.increment_executions(id uuid)
returns void language sql as $$
  update public.scripts set executions = executions + 1 where scripts.id = increment_executions.id;
$$;
