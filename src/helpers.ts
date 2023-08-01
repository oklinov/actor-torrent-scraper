import { RequestOptions } from 'crawlee';

import { Input, Labels, RequestGenerator, Scraper, UserData } from './types.js';

const DEFAULT_SCRAPERS: Scraper[] = ['gloTorrents', 'solidTorrents', 'limeTorrents', 'nyaa', 'thePirateBay'];

/**
 * This function returns a new `Input` object with `scrapers` set to `DEFAULT_SCRAPERS` if its empty
 */
export const handleInput = (input: Input): Input => {
    const { scrapers } = input;
    const selectedScrapers = (scrapers && scrapers.length > 0) ? scrapers : DEFAULT_SCRAPERS;
    return {
        ...input,
        scrapers: selectedScrapers,
    };
};

const REQUEST_GENERATORS: Record<Scraper, RequestGenerator> = {
    gloTorrents: (query, page) => ({
        url: `https://www.gtdb.to/search_results.php?search=${query}&sort=seeders&order=desc&page=${page}`,
        label: Labels.GLO,
    }),
    thePirateBay: (query, page) => ({
        url: `https://tpb.party/search/${query}/${page + 1}/99/0`,
        label: Labels.TPB,
    }),
    nyaa: (query, page) => ({
        url: `https://nyaa.si?q=${query}&s=seeders&o=desc&p=${page + 1}`,
        label: Labels.NYAA,
    }),
    limeTorrents: (query, page) => ({
        url: `https://www.limetorrents.to/search/all/${query}/seeds/${page + 1}/`,
        label: Labels.LIME,
    }),
    solidTorrents: (query, page) => ({
        url: `https://solidtorrents.to/search?q=${query}&sort=seeders&page=${page + 1}`,
        label: Labels.SOLID_TORRENTS,
    }),
};

export const createPageRequest = (scraper: Scraper, query: string, page = 0): RequestOptions<UserData> => {
    return REQUEST_GENERATORS[scraper](encodeURIComponent(query), page);
};

export const createInitialRequests = ({ scrapers, query }: Input): RequestOptions<UserData>[] => {
    const requests: RequestOptions<UserData>[] = [];
    for (const scraper of scrapers) {
        requests.push(createPageRequest(scraper, query));
    }

    return requests;
};
