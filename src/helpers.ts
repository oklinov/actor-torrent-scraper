import { RequestOptions } from 'crawlee';

import {
    Input,
    Labels,
    NextPageHandlerOptions,
    RequestGenerator,
    TorrentSite,
    UserData,
} from './types.js';

const DEFAULT_TORRENT_SITES: TorrentSite[] = [
    'gloTorrents',
    'solidTorrents',
    'limeTorrents',
    'nyaa',
    'thePirateBay',
];

/**
 * This function returns a new `Input` object with `torrentSites` set to `DEFAULT_TORRENT_SITES` if its empty
 */
export const handleInput = (input: Input): Input => {
    const { minSeedsForNextPage } = input;
    let { pageLimit, torrentSites } = input;
    torrentSites = (torrentSites && torrentSites.length > 0)
        ? torrentSites
        : DEFAULT_TORRENT_SITES;
    if (pageLimit === null && minSeedsForNextPage === null) {
        pageLimit = 1;
    }
    return {
        ...input,
        pageLimit,
        torrentSites,
    };
};

const REQUEST_GENERATORS: Record<TorrentSite, RequestGenerator> = {
    gloTorrents: (userData) => ({
        url: `https://www.gtdb.to/search_results.php?search=${userData.query}&sort=seeders&order=desc&page=${userData.page}`,
        label: Labels.GLO,
        userData,
    }),
    thePirateBay: (userData) => ({
        url: `https://tpb.party/search/${userData.query}/${userData.page + 1}/99/0`,
        label: Labels.TPB,
        userData,
    }),
    nyaa: (userData) => ({
        url: `https://nyaa.si?q=${userData.query}&s=seeders&o=desc&p=${userData.page + 1}`,
        label: Labels.NYAA,
        userData,
    }),
    limeTorrents: (userData) => ({
        url: `https://www.limetorrents.to/search/all/${userData.query}/seeds/${userData.page + 1}/`,
        label: Labels.LIME,
        userData,
    }),
    solidTorrents: (userData) => ({
        url: `https://solidtorrents.to/search?q=${userData.query}&sort=seeders&page=${userData.page + 1}`,
        label: Labels.SOLID_TORRENTS,
        userData,
    }),
};

export const createPageRequest = (userData: UserData): RequestOptions<UserData> => {
    return REQUEST_GENERATORS[userData.torrentSite](userData);
};

export const createInitialRequests = ({
    minSeedsForNextPage,
    pageLimit,
    query,
    torrentSites,
}: Input): RequestOptions<UserData>[] => {
    const requests: RequestOptions<UserData>[] = [];
    for (const torrentSite of torrentSites) {
        const userData: UserData = {
            minSeedsForNextPage,
            page: 0,
            pageLimit,
            query: encodeURIComponent(query),
            torrentSite,
        };
        requests.push(createPageRequest(userData));
    }

    return requests;
};

/**
 * This function determines whether the next page should be scraped based on
 * `pageLimit` and `minSeedsForNextPage` values
 */
export const handleNextPage = async ({
    ctx,
    hasNextPage,
    lastTorrent,
}: NextPageHandlerOptions) => {
    if (!lastTorrent) {
        return;
    }
    const { crawler, log, request } = ctx;
    const { loadedUrl, userData } = request;
    const { minSeedsForNextPage, page, pageLimit } = userData;
    const nextPage = page + 1;
    const reachedPageLimit = pageLimit && nextPage >= pageLimit;
    if (reachedPageLimit) {
        log.info(`Reached page limit (${pageLimit})`);
        return;
    }
    const { seeds: minSeeds } = lastTorrent;
    const satisfiesSeedLimit = minSeedsForNextPage === null || minSeeds >= minSeedsForNextPage;
    if (!satisfiesSeedLimit) {
        log.info(`The last torrent has ${minSeeds} seeds, at least ${minSeedsForNextPage} seeds are required to scrape next page`);
        return;
    }
    if (!hasNextPage) {
        log.info(`No more pages to scrape at ${new URL(loadedUrl!).origin}`);
        return;
    }
    const nextRequest = createPageRequest({
        ...userData,
        page: nextPage,
    });
    log.info(`Adding next page (${nextPage}: ${nextRequest.url}) to queue`);
    await crawler.addRequests([nextRequest]);
};

export const parseNumber = (text: string): number | null => {
    const seeds = text.trim().replace(/[\s,]/g, '');
    return seeds.match(/^\d+$/) ? parseInt(seeds, 10) : null;
};
