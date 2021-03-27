-- Function: public.delete_book(integer)

-- DROP FUNCTION public.delete_book(integer);

CREATE OR REPLACE FUNCTION public.delete_book(delete_id integer DEFAULT NULL::integer)
  RETURNS void AS
$BODY$
	BEGIN
            DELETE FROM books_dev
            where books_dev.id = delete_id;
	END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.delete_book(integer)
  OWNER TO postgres;
