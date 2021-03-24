import os, requests, psycopg2, datetime
from connections import connections as c

class BooksAPI():
    con = psycopg2.connect(database=c.DB_NAME, host=c.DB_HOST, port=c.DB_PORT, user=c.DB_USER)

    def select(self, args):
        
        cur = self.con.cursor()
        cur.callproc(
            "select_books", 
            [
                args.get("book_id"),
                args.get("title"),
                args.get("author"),
                args.get("genre")
            ]
        )
        result = cur.fetchall()
        payload = []
        for book in result:
            item = {
                "id" : book[0],
                "title": book[1],
                "author": book[2],
                "genre": book[3],
                "start": book[4],
                "end": book[5],
                "pages": book[6],
                "wordCount": book[7],
                "format": book[8],
                "rating": book[9]
            }
            payload.append(item)
        return payload
