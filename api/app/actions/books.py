import os, requests, psycopg2, datetime
from connections import connections as c


def connectToBooksPostgres():
    psql_con = psycopg2.connect(database=c.DB_NAME, host=c.DB_HOST, port=c.DB_PORT, user=c.DB_USER)
    return psql_con


def select(params):
    book_id = params.get("book_id")
    title = params.get("title")
    author = params.get("author")
    genre = params.get("genre")
    con = connectToBooksPostgres()
    cur = con.cursor()
    cur.callproc("select_books", [book_id, title, author, genre])
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
            "wordCount": book[7]
        }
        payload.append(item)
    return payload
