import { Element } from 'cheerio';

export type Input = {
    query: string
}

export type UserData = {
    baseUrl: string
    torrent?: TorrentItem
}

export const enum Labels {
    GLO = 'GLO',
    TPB = 'TPB',
    LIME = 'LIME',
    LIME_ITEM = 'LIME_ITEM',
    NYAA = 'NYAA',
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
    website: string
}

export type RowParser = (rowEl: Element, index: number) => TorrentItem | null;
