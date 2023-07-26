import { Dataset, createCheerioRouter } from 'crawlee';
import { Labels, TorrentItem, UserData } from './types.js';

export const router = createCheerioRouter();

router.addHandler<UserData>(Labels.GLO, async ({ request, $, log }) => {
    const { userData: { baseUrl }, loadedUrl } = request;
    const rowEls = $('table tr.t-row');
    log.info(`Found ${rowEls.length} torrents on ${loadedUrl}`);
    for (const rowEl of rowEls) {
        const titleEl = $(rowEl).find('td:nth-child(2) a:nth-child(2)');
        const title = titleEl.text().trim();
        if (!title) {
            log.warning('Missing title, skipping');
            continue;
        }
        const webUrl = titleEl.attr('href');
        const downloadUrl = $(rowEl).find('td:nth-child(3) a').attr('href');
        const magnetUrl = $(rowEl).find('td:nth-child(4) a').attr('href');
        const size = $(rowEl).find('td:nth-child(5) a').text().trim();
        const seeds = $(rowEl).find('td:nth-child(6)').text().trim();
        const leeches = $(rowEl).find('td:nth-child(7)').text().trim();
        const uploader = $(rowEl).find('td:nth-child(8) a font').text().trim();

        Dataset.pushData<TorrentItem>({
            title,
            webUrl,
            downloadUrl,
            magnetUrl,
            size,
            seeds,
            leeches,
            uploader,
            website: baseUrl,
        });
    }
});

router.addHandler<UserData>(Labels.TPB, async ({ request, $, log }) => {
    const { userData: { baseUrl }, loadedUrl } = request;
    const rowEls = $('table tr');
    log.info(`Found ${rowEls.length} torrents on ${loadedUrl}`);
    for (const rowEl of rowEls) {
        const titleEl = $(rowEl).find('td:nth-child(2) a');
        const title = titleEl.text().trim();
        if (!title) {
            log.warning('Missing title, skipping');
            continue;
        }
        const webUrl = titleEl.attr('href');
        const magnetUrl = $(rowEl).find('td:nth-child(4) a[href^="magnet"]').attr('href');
        const size = $(rowEl).find('td:nth-child(5)').text().trim();
        const seeds = $(rowEl).find('td:nth-child(6)').text().trim();
        const leeches = $(rowEl).find('td:nth-child(7)').text().trim();
        const uploader = $(rowEl).find('td:nth-child(8)').text().trim();
        Dataset.pushData<TorrentItem>({
            title,
            webUrl,
            magnetUrl,
            seeds,
            leeches,
            uploader,
            size,
            website: baseUrl,
        });
    }
});

router.addHandler<UserData>(Labels.NYAA, async ({ request, $, log }) => {
    const { userData: { baseUrl }, loadedUrl } = request;
    const rowEls = $('table tr.default');
    log.info(`Found ${rowEls.length} torrents on ${loadedUrl}`);
    for (const rowEl of rowEls) {
        const titleEl = $(rowEl).find('td:nth-child(2) a[href^=/view]');
        const title = titleEl.text().trim();
        if (!title) {
            log.warning('Missing title, skipping');
            continue;
        }
        const webUrlHref = titleEl.attr('href');
        const webUrl = webUrlHref && new URL(webUrlHref, baseUrl).toString();
        const downloadUrlHref = $(rowEl).find('td:nth-child(3) a[href^=/download]').attr('href');
        const downloadUrl = downloadUrlHref && new URL(downloadUrlHref, baseUrl).toString();
        const magnetUrl = $(rowEl).find('td:nth-child(3) a[href^="magnet:"]').attr('href');
        const size = $(rowEl).find('td:nth-child(4)').text().trim();
        const seeds = $(rowEl).find('td:nth-child(6)').text().trim();
        const leeches = $(rowEl).find('td:nth-child(7)').text().trim();
        Dataset.pushData<TorrentItem>({
            title,
            webUrl,
            magnetUrl,
            size,
            seeds,
            leeches,
            downloadUrl,
            website: baseUrl,
        });
    }
});

router.addHandler<UserData>(Labels.LIME, async ({ crawler, request, $, log }) => {
    const { userData: { baseUrl }, loadedUrl } = request;
    const rowEls = $('#content table.table2 tr');
    const torrents: TorrentItem[] = [];
    for (const [index, rowEl] of rowEls.toArray().entries()) {
        const titleCellEls = $(rowEl).find('td:nth-child(1) a');
        if (titleCellEls.length !== 2) {
            log.warning(`Expected exactly 2 anchor tags inside title cell, skipping item at index ${index}`);
            continue;
        }
        const title = $(titleCellEls[1]).text().trim();
        const webUrlHref = $(titleCellEls[1]).attr('href');
        const webUrl = webUrlHref && new URL(webUrlHref, baseUrl).toString();
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
            website: baseUrl,
        });
    }
    log.info(`Found ${torrents.length} torrents on ${loadedUrl}`);
    crawler.addRequests(torrents.map((torrent) => ({
        url: torrent.webUrl,
        label: Labels.LIME_ITEM,
        userData: {
            torrent,
            baseUrl,
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
    log.info(`Found magnet url of ${torrent?.title} at ${loadedUrl}`);
    Dataset.pushData({
        ...torrent,
        magnetUrl,
    });
});
