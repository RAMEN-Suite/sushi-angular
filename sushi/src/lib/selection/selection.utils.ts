import { SelectionValue } from '../sushi.types';
import { SelectionCompareWith, SelectionFilter, SelectionOption } from './selection.interfaces';

export const compareSelectionValues: SelectionCompareWith = (first: SelectionValue, second: SelectionValue): boolean =>
  Object.is(first, second);

export const filterSelectionOption: SelectionFilter = (option: SelectionOption, query: string): boolean => {
  const normalizedQuery: string = query.trim().toLocaleLowerCase();
  return option.label.toLocaleLowerCase().includes(normalizedQuery);
};
