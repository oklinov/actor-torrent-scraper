import { Element } from 'cheerio';

export type Input = {
    query: string
    scrapers: Scraper[]
}

export type UserData = {
    torrent?: TorrentItem
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
    seeds: string
    leeches: string
    magnetUrl?: string
    webUrl?: string
    downloadUrl?: string
    origin: string
}

export type RowParser = (rowEl: Element) => TorrentItem | null;
