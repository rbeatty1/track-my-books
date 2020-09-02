import requests
from connections import connections as c
class gbooks():
    google_api_key = c.GBOOKS_API_KEY

    def search(self, value):
        params = {"q":value, 'key': self.google_api_key}
        r = requests.get(url="https://www.googleapis.com/books/v1/volumes", params=params)
        rj = r.json()
        if rj["items"] is not None and len(rj["items"]) > 0:
            return rj["items"][0]["volumeInfo"]
        else:
            return None