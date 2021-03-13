import Landing from '@/views/Landing.vue';

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
describe('Landing Page', () => {
  it('calculates the year-to-date pages read', () => {
    expect(parseInt(Landing.computed.getYearToDatePageTotal.call(books), 10)).toBe(579);
  });

  it('returns 0 if no books have been read this year', () => {
    expect(parseInt(Landing.computed.getYearToDatePageTotal.call( { loaded: true, data: null }), 10)).toBe(0);
    expect(parseInt(Landing.computed.getYearToDatePageTotal.call( { loaded: true, data: [] }), 10)).toBe(0);
  });

  it('gets the title of the most recently started book that doesn\'t have an end date', () => {
    expect(Landing.computed.getCurrentlyReading.call(books)).toBe(books.data[0].title);
  });

  it('returns status indicator if all books have an end date', () => {
    books.data[0].end = new Date();
    expect(Landing.computed.getCurrentlyReading.call(books)).toBe('Not readin\' nothing');
    expect(Landing.computed.getCurrentlyReading.call({ loaded: true, data: [] })).toBe('Not readin\' nothing');
  });
});
