const formatNumber = (num) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
const placeHolder = 'SHUT UP THE LINTER';

export {
  formatNumber,
  placeHolder,
};
