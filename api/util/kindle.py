import sqlite3, psycopg2, datetime, requests, os, shutil, sys

class kindle():
    select_words = """
        SELECT 
            w.word,
            w.timestamp,
            l.usage
        FROM WORDS w 
        INNER JOIN LOOKUPS l ON 
            l.word_key = w.id
        WHERE l.book_key = '{0}'
    """

    select_books = """
        SELECT 
            id
            ,title
            ,authors
        FROM BOOK_INFO;
    """

    def get_sqlite_connection(self):
        backups_path = 'D:/Projects/python/Books/backups/kindle'
        backup_files = os.listdir(backups_path)
        paths = [os.path.join(backups_path, basename) for basename in backup_files]
        most_recent_backup = max(paths, key=os.path.getctime)
        return sqlite3.connect(most_recent_backup)

    def get_kindle_books(self):
        sql_con = self.get_sqlite_connection()
        kindle_books = sql_con.execute(self.select_books)
        books = []
        for b in kindle_books:
            book_dict = {
                "kindle_id" : b[0],
                "title" : b[1],
                "author" : b[2]
            }
            books.append(book_dict)
        return books

    def get_kindle_words(self, book_id):
        sql_con = self.get_sqlite_connection()
        select_book_words = self.select_words.format(book_id)

        book_words = sql_con.execute(select_book_words)

        words = []

        for w in book_words:
            word_dict = {
                "word" : w[0],
                "timestamp" : w[1],
                "context" : w[2]
            }
            words.append(word_dict)

        return words


    