import { shallowMount } from '@vue/test-utils'

import BooksTotalSummary from '@/components/BooksTotalSummary.vue';
import { books } from '../../testData';
import { formatNumber } from '@/util/Helpers';

describe('BooksTotalSummary Component', () => {
  const mountedTotalSummary = shallowMount(BooksTotalSummary, { props: { booksData: books.data } });
  it('should only return books with a not-null end date', () => {
    const finishedBooks = mountedTotalSummary.vm.getFinishedBooks();
    const allBooksFinished = finishedBooks.filter((b) => b.end).length === finishedBooks.length;

    expect(allBooksFinished).toBeTruthy();
  })
  it('should calculate the sum of vocabulary words encountered in all books', () => {
    const calculatedVocabWords = mountedTotalSummary.vm.getTotalVocabWords();

    expect(calculatedVocabWords).toBe("25");
  })
  it('should calculate the sum of pages in completed books', () => {
    const calculatedPagesRead = mountedTotalSummary.vm.getTotalPagesRead();

    expect(calculatedPagesRead).toBe(formatNumber(1245));
  })

})
