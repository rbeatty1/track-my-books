-- Function: public.upsert_book(text, text, text, text, text, text, integer)

-- DROP FUNCTION public.upsert_book(text, text, text, text, text, text, integer);

CREATE OR REPLACE FUNCTION public.upsert_book(
    upsert_id text DEFAULT NULL::text,
    upsert_title text DEFAULT NULL::text,
    upsert_author text DEFAULT NULL::text,
    upsert_genre text DEFAULT NULL::text,
    upsert_start date DEFAULT NULL::date,
    upsert_end date DEFAULT NULL::date,
    upsert_pages integer DEFAULT NULL::integer)
  RETURNS void AS
$BODY$
	BEGIN
		INSERT INTO public.books (id, title, author, genre, start_dt, end_dt, pages)
		VALUES (upsert_id, upsert_title, upsert_author, upsert_genre, upsert_start, upsert_end, upsert_pages)
		ON CONFLICT (title)
		DO
			UPDATE set
				title = upsert_title,
				start_dt = upsert_start,
				end_dt = upsert_end;
	END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.upsert_book(text, text, text, text, date, date, integer)
  OWNER TO postgres;
