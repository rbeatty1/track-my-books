import Landing from '@/views/Landing.vue';
import { books } from '../../testData.js';

describe('Landing Page', () => {
  it('calculates the year-to-date pages read', () => {
    expect(parseInt(Landing.computed.getYearToDatePageTotal.call(books), 10)).toBe(579);
  });

  it('returns 0 if no books have been read this year', () => {
    expect(parseInt(Landing.computed.getYearToDatePageTotal.call( { loaded: true, data: null }), 10)).toBe(0);
    expect(parseInt(Landing.computed.getYearToDatePageTotal.call( { loaded: true, data: [] }), 10)).toBe(0);
  });

  it('gets the title of the most recently started book that doesn\'t have an end date', () => {
    expect(Landing.computed.activelyReading.call(books)).toBe(books.data[0].title);
  });

  it('returns status indicator if all books have an end date', () => {
    books.data[0].end = new Date();
    expect(Landing.computed.activelyReading.call(books)).toBe('Not readin\' nothing');
    expect(Landing.computed.activelyReading.call({ loaded: true, data: [] })).toBe('Not readin\' nothing');
  });
});
