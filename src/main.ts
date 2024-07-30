import open from 'open';

import { parseArguments } from './arguments.js';
import { buildUrl } from './buildUrl.js';
import { reverseUrl } from './reverseUrl.js';

const parsed = parseArguments();
const dry = parsed.dry === 'true';

if (typeof parsed.url === 'string')
  console.log(reverseUrl(parsed.url) ?? 'Failed parsing the URL');
else {
  const url = buildUrl(parsed);
  if (dry) console.log(url);
  else open(url).catch(console.error);
}
