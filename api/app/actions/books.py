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
                args["id"],
                args["title"],
                args["author"],
                args["genre"],
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

    def create(self, data):
        create = """
        SELECT
        {proc}(
            %s::text,
            %s::text,
            %s::text,
            %s::date,
            %s::date,
            %s::integer,
            %s::integer,
            %s::integer
        );"""
        cur = self.con.cursor()
        try:
            cur.execute(
                sql.SQL(create)
                .format(proc=sql.Identifier('insert_book')),
                [
                    data['title'],
                    data['author'],
                    data['genre'],
                    data['start'],
                    data['end'],
                    data['pages'],
                    data['rating'],
                    data['format']
                ]
            )

            self.con.commit()
            new_id = cur.fetchone()[0]
            new_book = self.select(
                {
                    'id': new_id,
                    'title': None,
                    'author': None,
                    'genre': None
                }
            )
            return new_book
        except Exception as e:
            self.con.rollback()
            return {
                'success': False,
                'msg': 'Failed to create record in database. ' + e
            }
    
    def update(self, data):
        cur = self.con.cursor()
        update = """
        SELECT
        {proc}(
            %s::integer,
            %s::text,
            %s::text,
            %s::text,
            %s::date,
            %s::date,
            %s::integer,
            %s::integer,
            %s::integer
        );"""
        book_format = 0
        if data['format'] == 'E-book':
            book_format = 1
        if data['format'] == 'Audiobook':
            book_format = 2
        try:
            cur.execute(
                sql.SQL(update)
                .format(proc=sql.Identifier('update_book')),
                [
                    data['id'],
                    data['title'],
                    data['author'],
                    data['genre'],
                    data['start'],
                    data['end'],
                    data['pages'],
                    data['rating'],
                    book_format
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

    def delete(self, data):
        cur = self.con.cursor()
        delete = """
        SELECT
        {proc}(
            %s::integer
        );"""
        try:
            cur.execute(
                sql.SQL(delete)
                .format(proc=sql.Identifier('delete_book')),
                [
                    data['id']
                ]
            )

            self.con.commit()
            return { 'success': True }
        except Exception as e:
            self.con.rollback()
            return {
                'success': False,
                'msg': 'Failed to update record in database. ' + e
            }

