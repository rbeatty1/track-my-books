import os, requests, psycopg2, datetime
from connections import connections as c


def connectToBooksPostgres():
    psql_con = psycopg2.connect(database=c.DB_NAME, host=c.DB_HOST, port=c.DB_PORT, user=c.DB_USER)
    return psql_con


def select(params):
    word_id = params.get("word_id")
    word = params.get("word")
    word_type = params.get("type")
    book_title = params.get("title")
    book_genre = params.get("genre")
    con = connectToBooksPostgres()
    cur = con.cursor()
    cur.callproc("select_vocab", [word_id, word, word_type, book_title, book_genre])
    result = cur.fetchall()
    payload = []
    for word in result:
        item = {
            "id" : word[0],
            "word": word[1],
            "context" : word[2],
            "timestamp" : word[3],
            "type" : word[4],
            "definition": word[5],
            "book": word[6],
            "author": word[7],
            "genre": word[8]
        }
        payload.append(item)
    return payload


def select_group_by_year_month(group_type):
    def filter_words_by_genre(arr, filter_value):
        l = list()
        for a in arr:
            if a[0] == filter_value:
                l.append([a[1], a[2]])
        return l
    con = connectToBooksPostgres()
    cur = con.cursor()
    if group_type == "genre":
        cur.callproc("select_vocab_genre_by_time")
    elif group_type == 'type':
        cur.callproc("select_vocab_type_by_time")
    else:
        return
    result = cur.fetchall()
    payload = []
    groupings = []
    for r in result:
        if r[0] not in groupings:
            groupings.append((r[0]))
    groupings.sort()
    for g in groupings:
        item = {
            "key" :  str(g).capitalize(),
            "values" : filter_words_by_genre(result, g)
        }
        payload.append(item)
    return payload

def select_word_type_by_group(group_type):
    con = connectToBooksPostgres()
    cur = con.cursor()
    cur.callproc("select_vocab_group", group_type)
