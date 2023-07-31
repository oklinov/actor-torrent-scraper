import { RequestOptions } from 'crawlee';

import { Input, Labels, Scraper, UserData } from './types.js';

export const createRequests = ({ query, scrapers }: Input): RequestOptions<UserData>[] => {
    const REQUESTS: Record<Scraper, RequestOptions<UserData>> = {
        gloTorrents: {
            url: `https://www.gtdb.to/search_results.php?search=${query}&sort=seeders&order=desc`,
            label: Labels.GLO,
        },
        thePirateBay: {
            url: `https://tpb.party/search/${query}/1/99/0`,
            label: Labels.TPB,
        },
        nyaa: {
            url: `https://nyaa.si?q=${query}&s=seeders&o=desc`,
            label: Labels.NYAA,
        },
        limeTorrents: {
            url: `https://www.limetorrents.to/search/all/${query}/seeds/1/`,
            label: Labels.LIME,
        },
        solidTorrents: {
            url: `https://solidtorrents.to/search?q=${query}&sort=seeders`,
            label: Labels.SOLID_TORRENTS,
        },
    };
    const DEFAULT_SCRAPERS: Scraper[] = ['gloTorrents', 'solidTorrents', 'limeTorrents', 'nyaa', 'thePirateBay'];
    const scrapersList = (scrapers && scrapers.length > 0) ? scrapers : DEFAULT_SCRAPERS;

    const requests: RequestOptions<UserData>[] = [];
    for (const scraper of scrapersList) {
        requests.push(REQUESTS[scraper]);
    }

    return requests;
};
