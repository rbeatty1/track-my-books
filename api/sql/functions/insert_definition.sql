-- Function: public.insert_definition(integer, text, text, text, text)

-- DROP FUNCTION public.insert_definition(integer, text, text, text, text);

CREATE OR REPLACE FUNCTION public.insert_definition(
    insert_id integer DEFAULT NULL::integer,
    insert_word_id integer DEFAULT NULL::integer,
    insert_type text DEFAULT NULL::text,
    insert_definition text DEFAULT NULL::text,
    insert_example text DEFAULT NULL::text)
  RETURNS void AS
$BODY$
	BEGIN
		INSERT INTO public.dict (id, word_id, type, definition, example)
		VALUES (insert_id, insert_word_id, insert_type, insert_definition, insert_example)
		ON CONFLICT (id)
		DO NOTHING;
	END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.insert_definition(integer, integer, text, text, text)
  OWNER TO postgres;