import os, requests, psycopg2, datetime
from connections import connections as c

class VocabAPI():
    con = psycopg2.connect(database=c.DB_NAME, host=c.DB_HOST, port=c.DB_PORT, user=c.DB_USER)
    def select(self, args):
        cur = self.con.cursor()
        cur.callproc(
            "select_vocab",
            [
                args.get("word_id"),
                args.get("word"),
                args.get("type"),
                args.get("title"),
                args.get("genre")
            ]
        )
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
