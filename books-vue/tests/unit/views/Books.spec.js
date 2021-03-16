import { shallowMount } from '@vue/test-utils'
import Books from '@/views/Books.vue';
import {books} from '../../testData';


describe('Books Page', () => {
  const mountedBooksPage = shallowMount(Books, { data() { return books } });
  it('creates an array of unique years for book dataset', () =>{
    const years = mountedBooksPage.vm.getUniqueYears();
    expect(years).toStrictEqual([2021, 2019]);
  })

  it("categorizes books data by year", () => {
    const books2019 = mountedBooksPage.vm.getBooksByYear(2019);
    expect(books2019.length).toBe(1);
  })
})