import requests

class gbooks():
    googleapikey="AIzaSyCQl-frpAHu2fWm96umaGYXw2d1kCrR5jo"

    def search(self, value):
        params = {"q":value, 'key':self.googleapikey}
        r = requests.get(url="https://www.googleapis.com/books/v1/volumes", params=params)
        rj = r.json()
        if rj["items"] is not None and len(rj["items"]) > 0:
            return rj["items"][0]["volumeInfo"]
        else:
            return None