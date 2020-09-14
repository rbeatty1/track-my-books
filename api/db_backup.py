import sqlite3, psycopg2, datetime, requests, os, shutil, sys
from psycopg2 import sql
import util.gBooks as gBooks
import util.goodreads as goodreads
import util.words as wordLookup
from connections import connections as c 
import util.dataCleanUp as clean
import util.kindle as kindle


def connectToBooksPostgres():
    psql_con = psycopg2.connect(database="books", host="localhost", port="5432", user="postgres")
    return psql_con

today = datetime.date.today()
date = today.strftime("%m_%d_%y")
proj_dir = 'D:/Projects/python/Books/backups'

google_books = gBooks.gbooks()
gr = goodreads.goodreads()
def_helper = wordLookup.words()
cleaner = clean.execute_cleanup_scripts()
kindle_helper = kindle.kindle()

## copy vocab.db off of kindle
try:
    og_db = 'E:/system/vocabulary/vocab.db'
    backup_db = os.path.join(proj_dir, "kindle", "vocab_{0}.db".format(date))
    if not os.path.exists(backup_db):
     shutil.copyfile(og_db, backup_db)
     print("Made backup at {0}".format(backup_db))
    elif not os.path.exists('E:/system'):
     print("Kindle not connected.")
    else:
     print("Today's backup already exists.")
except Exception as e:
    print(e)

 ## back up psql tables
backup_psql = os.path.join(proj_dir, "postgres", "backup_{0}.sql".format(date))
try:
    con = connectToBooksPostgres()
    select_words = """SELECT id, book_id, word, timestamp, context FROM words;"""
    select_books = """ SELECT id, title, author, genre, start_date, end_date, pages FROM books;"""
    select_def = """ SELECT id, word_id, type, definition, example FROM dict;"""
    cur = con.cursor()
    cur.execute(select_words)
    f = open(backup_psql, 'w', encoding="utf-8")
    wrd_idx = 1
    book_idx = 1
    def_idx = 1
    for r in cur:
        if wrd_idx == 1:
            f.write("INSERT INTO words(id, book_id, word, timestamp, context) VALUES({0}, {1}, '{2}', {3}, '{4}')\n"
                    .format(r[0], r[1], r[2], r[3], r[4])
                    )
        else:
            f.write(",({0}, '{1}', '{2}', {3}, '{4}')\n"
                    .format(r[0], r[1], r[2], r[3], r[4]))
        wrd_idx += 1
    cur.execute(select_books)
    for r in cur:
        if book_idx == 1:
            f.write("INSERT INTO books(id, title, author, genre, start, end, pages) VALUES({0}, '{1}', '{2}', '{3}', '{4}', '{5}', {6})\n"
                    .format(r[0], r[1], r[2], r[3], r[4], r[5], r[6])
                    )
        else:
            f.write(",('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', {6})\n"
                    .format(r[0], r[1], r[2], r[3], r[4], r[5], r[6])
                    )
        book_idx += 1
    cur.execute(select_def)
    for r in cur:
        if def_idx == 1:
            f.write("INSERT INTO dict(id, word_id, type, definition, example) VALUES({0}, '{1}', '{2}', '{3}', '{4}')\n"
                    .format(r[0], r[1], r[2], r[3], r[4])
                    )
        else:
            f.write(",('{0}', '{1}', '{2}', '{3}', '{4})\n"
                    .format(r[0], r[1], r[2], r[3], r[4])
                    )
        def_idx += 1
    del cur
except psycopg2.DatabaseError as e:
    print(e)
finally:
    print("Backed up {0} books, {1} words, {2} definitions".format(book_idx, wrd_idx, def_idx))
    con.close()


read_books = gr.get_shelf_books('read')
currently_reading = gr.get_shelf_books('currently-reading')

psql_con = connectToBooksPostgres()
cur = psql_con.cursor()
for b in read_books:
   try:
       if b["start_date"] is not None:
           start = b["start_date"]
       else:
           start = None
       if b["end_date"] is not None:
           end = b["end_date"]
       else:
           end = None
       cur.callproc(
           "upsert_book",
           [
               b["id"],
               b["title"],
               b["author"],
               None,
               start,
               end,
               b["pages"]
           ]
       )
       psql_con.commit()
   except Exception as e:
       print(b["title"])
       print(e)


## insert data
insert_book = """INSERT INTO {tbl} (id, title, author, genre, pages)
SELECT
    %s, %s, %s, %s, %s
WHERE NOT EXISTS(
    SELECT title
    FROM {tbl}
    WHERE id=%s OR title=%s
)"""
insert_word = """INSERT INTO {tbl} (id, book_id, word, timestamp, context)
SELECT
    (SELECT MAX(ID)+1 from WORDS)
    , %s
    , %s
    , %s
    , %s
WHERE NOT EXISTS (
    SELECT word
    FROM {tbl} 
    WHERE word=%s
)

RETURNING id;"""
psql_con = connectToBooksPostgres()
cur = psql_con.cursor()
word_id = 1
bk = gBooks.gbooks()
wordLookup = wordLookup.words()
for b in kindle_helper.get_kindle_books():
    cur.callproc("select_books", [None, b["title"], None, None])
    psql_book = cur.fetchall()
    book_id = None
    if( len(psql_book) > 0):
        read_dates_exist = list(filter(lambda x: x[4] is not None or x[5] is not None, psql_book))
        if (len(read_dates_exist) > 0):
            book_id = read_dates_exist[0][0]
        else:
            continue
                                
    else:
        q = "{0} {1}".format(b["title"], b["author"])
        gBook = bk.search(q)
        if gBook is not None:
            try:
                book_id = gBook["industryIdentifiers"][0]["identifier"]
                cur.execute(
                    sql.SQL(insert_book)
                    .format(tbl=sql.Identifier('books')),
                    [
                    book_id,
                    gBook["title"],
                    gBook["authors"][0],
                    gBook["categories"][0],
                    gBook["pageCount"],
                    book_id,
                    gBook["title"]
                    ]
                )
                psql_con.commit()
            except Exception as e:
                print(e)
        else:
            continue                
    
    for word in kindle_helper.get_kindle_words(b["kindle_id"]):
        w = wordLookup.search(word["word"])
        if w is not None:
            result = w[0]
            if 'examples' in result:
                ex = result["examples"][0]
            else:
                ex = ""
            cur.execute(
                sql.SQL(insert_word)
                .format(tbl=sql.Identifier('words')),
                [ book_id, word["word"], word["timestamp"], word["context"], word["word"]]
            )
            
            if cur.fetchone() is not None:
                inserted_word_id = cur.fetchone()[0]
                cur.callproc(
                    "insert_definition",
                    [
                        int(inserted_word_id),
                        int(inserted_word_id),
                        result["partOfSpeech"],
                        result["definition"],
                        ex
                    ]
                )
                
        else:
            print("Could not find definition for {0}".format(word["word"]))
        psql_con.commit()

psql_con.close()
del psql_con

cleaner.cleanup_db()


