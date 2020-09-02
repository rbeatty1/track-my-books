-- Function: public.select_vocab(integer, text, text, text, text)

-- DROP FUNCTION public.select_vocab(integer, text, text, text, text);

CREATE OR REPLACE FUNCTION public.select_vocab(
    IN select_id integer DEFAULT NULL::integer,
    IN select_word text DEFAULT NULL::text,
    IN select_word_type text DEFAULT NULL::text,
    IN select_book text DEFAULT NULL::text,
    IN select_genre text DEFAULT NULL::text)
  RETURNS TABLE(word_id integer, word text, word_context text, word_type text, definition text, book_title text, book_author text, book_genre text) AS
$BODY$
	SELECT 
		w.id as word_id
		,w.word as word
		,w.context as word_context
		,d.type as word_type
		,d.definition as definition
		,b.title as book_title
		,b.author as book_author
		,b.genre as book_genre
	FROM words w
	INNER JOIN books b ON
		b.id = w.book_id
	LEFT JOIN dict d ON
		d.word_id = w.id
	WHERE
		(select_id IS NULL OR w.id = select_id) OR
		(select_word IS NULL OR w.word = select_word) OR
		(select_word_type IS NULL OR d.type = select_word_type) OR
		(select_book IS NULL OR b.title = select_book) OR
		(select_genre IS NULL OR b.genre = select_genre)
	ORDER BY w.word;
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.select_vocab(integer, text, text, text, text)
  OWNER TO postgres;
