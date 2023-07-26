import { Actor, log } from 'apify';
import { CheerioCrawler, RequestOptions } from 'crawlee';
import { router } from './routes.js';
import { Input, Labels, UserData } from './types.js';

await Actor.init();
const input = await Actor.getInput<Input>();
log.info(JSON.stringify(input));
const { query } = input!;

const requests: RequestOptions<UserData>[] = [
    {
        url: `https://www.gtdb.to/search_results.php?search=${query}`,
        label: Labels.GLO,
        userData: {
            baseUrl: 'https://www.gtdb.to',
        },
    },
    {
        url: `https://tpb.party/search/${query}/1/99/0`,
        label: Labels.TPB,
        userData: {
            baseUrl: 'https://ypb.party',
        },
    },
    {
        url: `https://nyaa.si?q=${query}&s=seeders&o=desc`,
        label: Labels.NYAA,
        userData: {
            baseUrl: 'https://nyaa.si',
        },
    },
];

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
});

await crawler.run(requests);

await Actor.exit();
