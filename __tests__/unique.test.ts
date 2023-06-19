import { unique } from '../utils.js';

describe('unique', () => {
  test('empty array', () => expect(unique([])).toEqual([]));
  test('duplicates', () => expect(unique(['1', '1', 2])).toEqual(['1', 2]));
});
