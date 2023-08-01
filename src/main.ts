import { Actor, log } from 'apify';
import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';
import { Input } from './types.js';
import { createRequests, handleInput } from './helpers.js';

await Actor.init();
let input = await Actor.getInput<Input>();
if (!input) throw new Error('Input not provided');
input = handleInput(input);
log.info(`Searching for "${input.query}" on ${input.scrapers.join(', ')}`);

const requests = createRequests(input);

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
});

await crawler.run(requests);

await Actor.exit();
