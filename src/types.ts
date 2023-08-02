import { Element } from 'cheerio';
import { CheerioCrawlingContext, Dictionary, Request, RequestOptions } from 'crawlee';

type PageContext = {
    query: string
    pageLimit: number | null
    minSeedsForNextPage: number | null
}

export type Input = PageContext & {
    scrapers: Scraper[]
}

export type UserData = PageContext & {
    torrent?: TorrentItem
    page: number
    scraper: Scraper
}

export type Scraper =
    | 'gloTorrents'
    | 'thePirateBay'
    | 'limeTorrents'
    | 'nyaa'
    | 'solidTorrents'

export const enum Labels {
    GLO = 'GLO',
    TPB = 'TPB',
    LIME = 'LIME',
    LIME_ITEM = 'LIME_ITEM',
    NYAA = 'NYAA',
    SOLID_TORRENTS = 'SOLID_TORRENTS',
}

export type TorrentItem = {
    title: string
    size?: string
    uploader?: string
    age?: string
    seeds: number
    leeches: number
    magnetUrl?: string
    webUrl?: string
    downloadUrl?: string
    origin: string
}

export type RowParser = (rowEl: Element) => TorrentItem | null;

export type RequestGenerator = (userData: UserData) => RequestOptions<UserData>;

export type HandlerContext = Omit<CheerioCrawlingContext<Dictionary, Dictionary>, 'request'> & {
    request: Request<UserData>;
}

export type NextPageHandlerOptions = {
    ctx: HandlerContext
    hasNextPage: boolean
    lastTorrent: TorrentItem | undefined
}
