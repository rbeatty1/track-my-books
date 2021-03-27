from connections import connections as c
import psycopg2, jwt, datetime
from werkzeug import security as ws
from flask_login import UserMixin

class User(UserMixin):
  def __init__(self, username, password):
    self.id = username
    self.password = password

  def auth_user(self):
    con = psycopg2.connect(database=c.DB_NAME, host=c.DB_HOST, port=c.DB_PORT, user=c.DB_USER)
    cur = con.cursor()
    cur.callproc(
      'select_user',
      [
        self.id
      ]
    )

    user = cur.fetchone()

    if user is None or ws.check_password_hash(user[1], self.password) is False:
      return None

    return user

  def get_auth_token(self):
    if self.auth_user() is not None:
      tokenOpts = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=300),
        'iat': datetime.datetime.utcnow(),
        'sub': self.id
      }
      return jwt.encode(tokenOpts, c.FLASK_SECRET_KEY, algorithm='HS256')

    else:
      return False
