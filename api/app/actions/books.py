import os, requests, psycopg2, datetime
from connections import connections as c
from psycopg2 import sql 

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

    def update(self, data):
        cur = self.con.cursor()
        update = """
            UPDATE {tbl}
                set end_dt = to_timestamp(%s, 'yyyy-MM-dd'),
                    rating = %s
            where id = %s;
        """
        select = """ CALL select_books(%s, %s, %s, %s);
        """
        try:
            cur.execute(
                sql.SQL(update)
                .format(tbl=sql.Identifier('books_dev')),
                [
                    data['end'],
                    data['rating'],
                    data['id']
                ]
            )

            self.con.commit()
            cur.callproc(
                "select_books", 
                [
                    str(data['id']),
                    None,
                    None,
                    None
                ]
            )

            payload = cur.fetchone()
            return {
                "id" : payload[0],
                "title": payload[1],
                "author": payload[2],
                "genre": payload[3],
                "start": payload[4].strftime('%m/%d/%Y'),
                "end": payload[5].strftime('%m/%d/%Y'),
                "pages": payload[6],
                "wordCount": payload[7],
                "format": payload[8],
                "rating": payload[9]
            }
        except Exception as e:
            self.con.rollback()
            return {
                'success': False,
                'msg': 'Failed to update record in database. ' + e
            }