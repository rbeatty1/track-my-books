import { mount } from '@vue/test-utils'

import YearlyBookSection from '@/components/YearlyBookSection.vue';
import { books } from '../../testData';
import { formatNumber } from '@/util/Helpers';

describe('Yearly Book Section Component', () => {
  const defaultProps = {
    open: false,
    booksData: books.data.slice(0,2),
    year: "2021", 
  };
  const mountedYearlyBookSection = mount(YearlyBookSection, { props: defaultProps });
  it("Clicking the control button should toggle the open property", () => {
    mountedYearlyBookSection.find('button[aria-controls="book-details-2021"]').trigger('click');
    expect(mountedYearlyBookSection.vm.open).toBe(!defaultProps.open);
  })

});

// describe('Yearly Book Section & Book Card Nav Button components realtionship', () => {
//   it("Clicking a book card nav button should update the active index of its parent yearly book section", () => {})
//   it("The displayed book cards should match the index of the active book card nav button", () => {})
// })