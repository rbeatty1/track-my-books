-- Function: public.insert_book(text, text, text, date, date, integer, integer, integer)

-- DROP FUNCTION public.insert_book(text, text, text, date, date, integer, integer, integer);

CREATE OR REPLACE FUNCTION public.insert_book(
    IN insert_title text DEFAULT NULL::text,
    IN insert_author text DEFAULT NULL::text,
    IN insert_genre text DEFAULT NULL::text,
    IN insert_start date DEFAULT NULL::date,
    IN insert_end date DEFAULT NULL::date,
    IN insert_pages integer DEFAULT NULL::integer,
    IN insert_rating integer DEFAULT NULL::integer,
    IN insert_format integer DEFAULT 0,
    OUT ret_id integer)
  RETURNS integer AS
$BODY$
	BEGIN
		INSERT INTO public.books_dev (title, author, genre, start_dt, end_dt, pages, rating, format)
		VALUES (insert_title, insert_author, insert_genre, insert_start, insert_end, insert_pages, insert_rating, insert_format)
		RETURNING id
		INTO ret_id;
	END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.insert_book(text, text, text, date, date, integer, integer, integer)
  OWNER TO postgres;
