import unittest, datetime,importlib, app

class TestBookAdapter(unittest.TestCase):
  adapter = app.books_adapter
  data = {
    'title': 'Test Book',
    'author': 'Test Author',
    'genre': 'Test Genre',
    'pages': 999,
    'start': datetime.datetime.utcnow(),
    'end': datetime.datetime.utcnow() + datetime.timedelta(days=7),
    'format': 1,
    'rating': 3
  }

  def setUp(self):
    app.api.testing = True
    self.app = app.api.test_client()
    self.test_create()

  def tearDown(self):
    self.test_delete()
    
  def test_select_by_id(self):
    result = self.adapter.select(
      {
        'id': self.data['id'],
        'title': None,
        'author': None,
        'genre': None,
      }
    )
    self.assertEqual(len(result), 1)
    self.assertEqual(result[0]['id'], self.data['id'])
    
  def test_select_by_genre(self):
    result = self.adapter.select({'id': None, 'title': None, 'author': None, 'genre': self.data['genre']})
    all_results_genre = True
    for r in result:
      if r['genre'] != self.data['genre']:
        all_results_genre = False
        
    self.assertTrue(all_results_genre)
    
  def test_create(self):
    result = self.adapter.create(self.data)
    self.assertEqual(len(result), 1)
    self.data['id'] = result[0]['id']

  def test_delete(self):
    result = self.adapter.delete(self.data)
    self.assertTrue(result['success'])


if __name__ == "__main__":
    TestBookAdapter().run()