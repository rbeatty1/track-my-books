from urllib import request
from bs4 import BeautifulSoup as soup
from connections import connections as c

class goodreads():
    user_id = c.GR_USER_ID
    dev_key = c.GR_DEV_KEY
    secret_key = c.GR_SECRET_KEY
    
    def get_shelf_books(self, shelf):
        url = "https://www.goodreads.com/review/list/{0}.xml?key={1}&v=2&shelf={2}&per_page=200".format(
            self.user_id,
            self.dev_key,
            shelf
        )
        results = request.urlopen(url)
        dump = soup(results, 'lxml-xml')
        books = dump.find_all('review')
        payload = []
        for book in books:
            isbn = book.find('isbn13').string
            title = book.find('title_without_series').string
            author = book.find('author').find('name').string
            pages = book.find('num_pages').string
            start = book.find('started_at').string
            end = book.find('read_at').string
            if isbn is not None:
                item = {
                    "id": isbn,
                    "title": title,
                    "author": author,
                    "pages": pages,
                    "start_date": start,
                    "end_date": end
                }
                payload.append(item)
            else:
                print("Book: {0}, started: {1}, ended: {2}".format(
                    title, start, end
                ))
        return payload


