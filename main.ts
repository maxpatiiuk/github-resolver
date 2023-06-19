import { parseArguments } from './arguments';
import { buildUrl } from './buildUrl';
import { reverseUrl } from './reverseUrl';

const parsed = parseArguments();
const dry = parsed.dry === 'true';

if (typeof parsed.url === 'string')
  console.log(reverseUrl(parsed.url) ?? 'Failed parsing the URL');
else {
  const url = buildUrl(parsed);
  if (dry) console.log(url);
  else window.open(url);
}
