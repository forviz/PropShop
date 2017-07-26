import _ from 'lodash';
import Fuse from 'fuse.js';

const fuseOption = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'title.en',
    'title.th',
  ],
};

const createRegExp = str => str;
// regex pattern '(cat)+\\s?(mat)|(mat)+\\s?(cat)';

 /*
   isContain function to check searchValue contain in option or not ?
   Note*
     all of searchValue seperated by space (' ') should be contained
 */
export const isContain = (option, searchValue) => {
  const searchCriterias = searchValue.split(' '); // split by space
  const found = _.every(searchCriterias, (searchCriteria) => {
    const regex = new RegExp(createRegExp(searchCriteria), 'gi');
    return regex.test(option.label);
  });
  return found;
};

/*
 * filter options by searchValue
 */
const defaultFilterOptions = (list, searchValue) => {
  // const filterOptionFunc = isContain;
  // return options.filter(option => filterOptionFunc(option, searchValue));

  const fuse = new Fuse(list, fuseOption); // "list" is the item array
  return fuse.search(searchValue);
};

export default defaultFilterOptions;
