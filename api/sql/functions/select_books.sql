-- Function: public.select_books(text, text, text, text)

--DROP FUNCTION public.select_books(text, text, text, text);

CREATE OR REPLACE FUNCTION public.select_books(
    IN select_id text DEFAULT NULL::integer,
    IN select_title text DEFAULT NULL::text,
    IN select_author text DEFAULT NULL::text,
    IN select_genre text DEFAULT NULL::text)
  RETURNS TABLE(id text, title text, author text, genre text, start_dt date, end_dt date, pages integer, word_count bigint) AS
$BODY$
	SELECT
		b.id
		,title
		,author
		,genre
		,start_dt
		,end_dt
		,pages
		,COALESCE(COUNT(DISTINCT(w.id)),0) as word_count
	FROM books b
	LEFT JOIN words w ON	
		w.book_id = b.id
	WHERE
		(select_title IS NULL or b.title = select_title) AND
		(select_id IS NULL OR b.id = select_id) AND
		(select_author IS NULL OR b.author LIKE select_author) AND
		(select_genre IS NULL OR b.genre = select_genre)
	GROUP BY
		b.id
		,title
		,author
		,genre
		,pages
	ORDER BY
		case when b.end_dt is NULL then 1 else 0 end, b.end_dt DESC;
		
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.select_books(text, text, text, text)
  OWNER TO postgres;
