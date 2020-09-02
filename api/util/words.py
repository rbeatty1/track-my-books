import requests

class words():
    endpoint = "https://wordsapiv1.p.rapidapi.com/words/{0}"

    headers= {
        'x-rapidapi-host': "wordsapiv1.p.rapidapi.com",
        'x-rapidapi-key': "8e9a0d976cmsh009ba69f32df17fp193c74jsne29de1655add"
    }

    def search(self, value):
        endpoint = self.endpoint.format(value)
        r = requests.request("GET", endpoint, headers=self.headers).json()
        if 'results' in r:
            return r["results"]
        else:
            return None
