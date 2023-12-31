import { Actor, log } from 'apify';
import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';
import { Input } from './types.js';
import { createInitialRequests, handleInput } from './helpers.js';

await Actor.init();
let input = await Actor.getInput<Input>();
if (!input) throw new Error('Input not provided');
input = handleInput(input);

const { pageLimit, query, torrentSites } = input;
log.info(`Searching for "${query}" on ${torrentSites.join(', ')}`);
log.info(`Page limit: ${pageLimit ?? 'not specified'}`);

const requests = createInitialRequests(input);

const proxyConfiguration = await Actor.createProxyConfiguration(input.proxyConfiguration);

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
});

await crawler.run(requests);

await Actor.exit();
