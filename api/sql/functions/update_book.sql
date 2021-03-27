-- Function: public.update_book(integer, text, text, text, date, date, integer, integer, integer)

-- DROP FUNCTION public.update_book(integer, text, text, text, date, date, integer, integer, integer);

CREATE OR REPLACE FUNCTION public.update_book(
    IN update_id integer DEFAULT NULL::integer,
    IN update_title text DEFAULT NULL::text,
    IN update_author text DEFAULT NULL::text,
    IN update_genre text DEFAULT NULL::text,
    IN update_start date DEFAULT NULL::date,
    IN update_end date DEFAULT NULL::date,
    IN update_pages integer DEFAULT NULL::integer,
    IN update_rating integer DEFAULT NULL::integer,
    IN update_format integer DEFAULT 0)
  RETURNS TABLE(id integer) AS
$BODY$
	BEGIN
	    UPDATE books_dev
	      SET
          title = update_title,
          author = update_author,
          genre = update_genre,
          start_dt = update_start,
          end_dt = update_end,
          pages = update_pages,
          rating = update_rating,
          format = update_format
      WHERE books_dev.id = update_id;
	RETURN QUERY(select books_dev.id from books_dev where books_dev.id = update_id);
	END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.update_book(integer, text, text, text, date, date, integer, integer, integer)
  OWNER TO postgres;
