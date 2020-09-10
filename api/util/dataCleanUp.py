from os import listdir
from os.path import isfile, join
import psycopg2
from connections import connections as c
from codecs import open

class execute_cleanup_scripts():
    script_dir = "D:/Projects/web/track-my-books/api/sql/setup"
    pg_con = psycopg2.connect(database=c.DB_NAME, host=c.DB_HOST, port=c.DB_PORT, user=c.DB_USER)

    def execute_script(self, file):
        fd = open(join(self.script_dir, file), mode="r", encoding="utf-8-sig")
        sql = fd.read()
        fd.close()
        
        cmds = sql.split(";")

        print("Executing {0}".format(file))
        for c in cmds:
            try:
                print(c)
                cur = self.pg_con.cursor()
                cur.execute(c)
                self.pg_con.commit()
            except Exception as e:
                print("{0} command skipped".format(c))
                print(e)
                self.pg_con.rollback()
    
    def cleanup_db(self):
        files = [f for f in listdir(self.script_dir) if isfile(join(self.script_dir, f))]
        for f in files:
            self.execute_script(f)
