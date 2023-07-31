import { Actor, log } from 'apify';
import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';
import { Input } from './types.js';
import { createRequests } from './helpers.js';

await Actor.init();
const input = await Actor.getInput<Input>();
if (!input) throw new Error('Input not provided');
log.info(JSON.stringify(input));

const requests = createRequests(input);

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
});

await crawler.run(requests);

await Actor.exit();
