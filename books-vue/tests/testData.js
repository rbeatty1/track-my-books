
const books = {
  loaded: true,
  data: [
    {
      id: 1,
      title: "Test Book 1",
      author: "Author 1",
      genre: "Test Genre",
      pages: 123,
      start: new Date(2021, 8, 1),
      end: null,
      format: 'Test',
      rating: null
    },
    {
      id: 2,
      title: "Test Book 2",
      author: "Author 2",
      genre: "Test Genre",
      pages: 456,
      start: new Date(2021, 7, 1),
      end: new Date(2021, 7, 17),
      format: 'Test',
      rating: 3
    },
    {
      id: 3,
      title: "Test Book 3",
      author: "Author 3",
      genre: "Test Genre 2",
      pages: 789,
      start: new Date(2019, 6, 1),
      end: new Date(2019, 5, 4),
      format: 'Test',
      rating: 4
    },
  ]
};

export {
  books
}