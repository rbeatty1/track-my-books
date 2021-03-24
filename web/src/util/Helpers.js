const formatNumber = (num) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
const placeHolder = 'SHUT UP THE LINTER';
const getCurrentlyReading = (books) => books.filter((b) => !b.end)
  .filter((b) => b.format !== 'Audiobook')
  .sort((a, b) => new Date(a.start) > new Date(b.start));
const calcPagesRead = (books) => formatNumber(books.reduce((acc, cur) => acc + cur.pages, 0));

export {
  calcPagesRead,
  formatNumber,
  getCurrentlyReading,
  placeHolder,
};
