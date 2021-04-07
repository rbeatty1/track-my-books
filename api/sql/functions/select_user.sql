-- Function: public.select_user(text)

-- DROP FUNCTION public.select_user(text);

CREATE OR REPLACE FUNCTION public.select_user(IN select_user text DEFAULT NULL::text)
  RETURNS TABLE(id text, pass_hash text) AS
$BODY$
	SELECT
		id,
		pass_hash
	FROM users
	WHERE
		id = select_user;
		
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.select_user(text)
  OWNER TO postgres;
