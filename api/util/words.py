import requests
from connections import connections as c

class words():
    endpoint = "https://wordsapiv1.p.rapidapi.com/words/{0}"

    headers= {
        'x-rapidapi-host': "wordsapiv1.p.rapidapi.com",
        'x-rapidapi-key': c.RAPID_API_KEY
    }

    def search(self, value):
        endpoint = self.endpoint.format(value)
        r = requests.request("GET", endpoint, headers=self.headers).json()
        if 'results' in r:
            return r["results"]
        else:
            return None
