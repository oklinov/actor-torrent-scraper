import { Dataset, createCheerioRouter } from 'crawlee';
import { Labels, RowParser, TorrentItem, UserData } from './types.js';

export const router = createCheerioRouter();

router.addHandler<UserData>(Labels.GLO, async ({ request, $, log }) => {
    const { loadedUrl } = request;
    const { origin } = new URL(loadedUrl!);
    const rowEls = $('table tr.t-row');
    const torrents: TorrentItem[] = [];
    for (const rowEl of rowEls) {
        const titleEl = $(rowEl).find('td:nth-child(2) a:nth-child(2)');
        const title = titleEl.text().trim();
        if (!title) {
            continue;
        }
        const webUrlHref = titleEl.attr('href');
        const webUrl = webUrlHref && new URL(webUrlHref, origin).toString();
        const downloadUrlHref = $(rowEl).find('td:nth-child(3) a').attr('href');
        const downloadUrl = downloadUrlHref && new URL(downloadUrlHref, origin).toString();
        const magnetUrl = $(rowEl).find('td:nth-child(4) a').attr('href');
        const size = $(rowEl).find('td:nth-child(5)').text().trim();
        const seeds = $(rowEl).find('td:nth-child(6)').text().trim();
        const leeches = $(rowEl).find('td:nth-child(7)').text().trim();
        const uploader = $(rowEl).find('td:nth-child(8) a font').text().trim();

        torrents.push({
            title,
            webUrl,
            downloadUrl,
            magnetUrl,
            size,
            seeds,
            leeches,
            uploader,
            origin,
        });
    }
    log.info(`Found ${rowEls.length} torrents on ${loadedUrl}`);
    await Dataset.pushData<TorrentItem>(torrents);
});

router.addHandler<UserData>(Labels.TPB, async ({ request, $, log }) => {
    const { loadedUrl } = request;
    const { origin } = new URL(loadedUrl!);
    const rowEls = $('table tr');
    const numOfCols = $(rowEls[0]).find('> th, > td').length;
    let rowParser: RowParser;

    // there are two variants of the tables, one with 4 columns and the other with 8
    // I could not determine how to request only one so I count with both variants
    switch (numOfCols) {
        case 4:
            rowParser = (rowEl) => {
                const mainCellEl = $(rowEl).find('td:nth-child(2)');
                const titleEl = $(mainCellEl).find('.detName a');
                const title = titleEl.text().trim();
                if (!title) {
                    return null;
                }
                const webUrl = titleEl.attr('href');
                const magnetUrl = $(mainCellEl).find('a[href^="magnet"]').attr('href');
                const descStr = $(mainCellEl).find('font.detDesc').text().trim();
                const descMatch = descStr.match(/^Uploaded\s*.*?,\s*Size (.*?),\s*ULed by\s*(.*?)$/);
                let size: string | undefined;
                let uploader: string | undefined;
                if (descMatch && descMatch.length === 3) {
                    size = descMatch[1];
                    uploader = descMatch[2];
                } else {
                    log.warning(`Unable to extract size and uploader from description: ${descStr}`);
                }
                const seeds = $(rowEl).find('td:nth-child(3)').text().trim();
                const leeches = $(rowEl).find('td:nth-child(4)').text().trim();
                return {
                    title,
                    webUrl,
                    magnetUrl,
                    size,
                    seeds,
                    leeches,
                    uploader,
                    origin,
                };
            };
            break;
        case 8:
            rowParser = (rowEl) => {
                const titleEl = $(rowEl).find('td:nth-child(2) a');
                const title = titleEl.text().trim();
                if (!title) {
                    return null;
                }
                const webUrl = titleEl.attr('href');
                const magnetUrl = $(rowEl).find('td:nth-child(4) a[href^="magnet"]').attr('href');
                const size = $(rowEl).find('td:nth-child(5)').text().trim();
                const seeds = $(rowEl).find('td:nth-child(6)').text().trim();
                const leeches = $(rowEl).find('td:nth-child(7)').text().trim();
                const uploader = $(rowEl).find('td:nth-child(8)').text().trim();
                return {
                    title,
                    webUrl,
                    magnetUrl,
                    size,
                    seeds,
                    leeches,
                    uploader,
                    origin,
                };
            };
            break;
        default:
            log.error(`Unexpected number of table columns: ${numOfCols}, aborting`);
            return;
    }
    log.info(`Using ${numOfCols}-column table parser`);
    const torrents: TorrentItem[] = [];
    for (const rowEl of rowEls) {
        const torrent = rowParser(rowEl);
        if (torrent) {
            torrents.push(torrent);
        }
    }
    log.info(`Found ${torrents.length} torrents on ${loadedUrl}`);
    await Dataset.pushData(torrents);
});

router.addHandler<UserData>(Labels.NYAA, async ({ request, $, log }) => {
    const { loadedUrl } = request;
    const { origin } = new URL(loadedUrl!);
    const rowEls = $('table tr.default');
    const torrents: TorrentItem[] = [];
    for (const rowEl of rowEls) {
        const titleEl = $(rowEl).find('td:nth-child(2) a[href^=/view]');
        const title = titleEl.text().trim();
        if (!title) {
            continue;
        }
        const webUrlHref = titleEl.attr('href');
        const webUrl = webUrlHref && new URL(webUrlHref, origin).toString();
        const downloadUrlHref = $(rowEl).find('td:nth-child(3) a[href^=/download]').attr('href');
        const downloadUrl = downloadUrlHref && new URL(downloadUrlHref, origin).toString();
        const magnetUrl = $(rowEl).find('td:nth-child(3) a[href^="magnet:"]').attr('href');
        const size = $(rowEl).find('td:nth-child(4)').text().trim();
        const seeds = $(rowEl).find('td:nth-child(6)').text().trim();
        const leeches = $(rowEl).find('td:nth-child(7)').text().trim();
        torrents.push({
            title,
            webUrl,
            magnetUrl,
            size,
            seeds,
            leeches,
            downloadUrl,
            origin,
        });
    }
    log.info(`Found ${rowEls.length} torrents on ${loadedUrl}`);
    await Dataset.pushData(torrents);
});

router.addHandler<UserData>(Labels.LIME, async ({ crawler, request, $, log }) => {
    const { loadedUrl } = request;
    const { origin } = new URL(loadedUrl!);
    const rowEls = $('#content table.table2 tr');
    const torrents: TorrentItem[] = [];
    for (const [index, rowEl] of rowEls.toArray().entries()) {
        const titleCellEls = $(rowEl).find('td:nth-child(1) a');
        if (titleCellEls.length !== 2) {
            log.warning(`Expected exactly 2 anchor tags inside title cell, skipping item at index ${index}`);
            continue;
        }
        const title = $(titleCellEls[1]).text().trim();
        if (!title) {
            continue;
        }
        const webUrlHref = $(titleCellEls[1]).attr('href');
        const webUrl = webUrlHref && new URL(webUrlHref, origin).toString();
        const downloadUrl = $(titleCellEls[0]).attr('href');
        const size = $(rowEl).find('td:nth-child(3)').text().trim();
        const seeds = $(rowEl).find('td:nth-child(4)').text().trim();
        const leeches = $(rowEl).find('td:nth-child(5)').text().trim();
        torrents.push({
            title,
            webUrl,
            downloadUrl,
            size,
            seeds,
            leeches,
            origin,
        });
    }
    log.info(`Found ${torrents.length} torrents on ${loadedUrl}`);
    await crawler.addRequests(torrents.map((torrent) => ({
        url: torrent.webUrl,
        label: Labels.LIME_ITEM,
        userData: {
            torrent,
        },
    })));
});

router.addHandler<UserData>(Labels.LIME_ITEM, async ({ request, $, log }) => {
    const { userData: { torrent }, loadedUrl } = request;
    const magnetUrl = $('.torrentinfo a[href^="magnet:"]').attr('href');
    if (!magnetUrl) {
        log.warning(`Could not find magnet url at ${loadedUrl}`);
        return;
    }
    log.info(`Found magnet url of "${torrent?.title}" at ${loadedUrl}`);
    await Dataset.pushData({
        ...torrent,
        magnetUrl,
    });
});

router.addHandler<UserData>(Labels.SOLID_TORRENTS, async ({ request, $, log }) => {
    const { loadedUrl } = request;
    const { origin } = new URL(loadedUrl!);
    const rowEls = $('.container li').toArray();
    const torrents: TorrentItem[] = [];
    for (const rowEl of rowEls) {
        const titleEl = $(rowEl).find('h5 a');
        const title = titleEl.text().trim();
        if (!title) {
            continue;
        }
        const webUrlHref = titleEl.attr('href');
        const webUrl = webUrlHref && new URL(webUrlHref, origin).toString();
        const statsEl = $(rowEl).find('.stats');
        const size = $(statsEl).find('div:nth-child(2)').text().trim();
        const seeds = $(statsEl).find('div:nth-child(3)').text().trim();
        const leeches = $(statsEl).find('div:nth-child(4)').text().trim();
        const linksEl = $(rowEl).find('.links');
        const magnetUrl = $(linksEl).find('a[href^="magnet:"]').attr('href');
        const downloadUrl = $(linksEl).find('a.dl-torrent').attr('href');
        torrents.push({
            title,
            webUrl,
            size,
            seeds,
            leeches,
            magnetUrl,
            downloadUrl,
            origin,
        });
    }
    log.info(`Found ${torrents.length} torrents on ${loadedUrl}`);
    await Dataset.pushData(torrents);
});
