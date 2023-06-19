import { unique } from '../utils';

describe('unique', () => {
  test('empty array', () => expect(unique([])).toEqual([]));
  test('duplicates', () => expect(unique(['1', '1', 2])).toEqual(['1', 2]));
});
