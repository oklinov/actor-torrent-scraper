# Torrent Scraper

This scraper collects information about torrents from popular torrent sites. It was inspired by [cli-torrent-dl](https://github.com/X0R0X/cli-torrent-dl). Torrents from the sites are sorted by the number of seeds.

Torrent sites used by the scraper:

- [gtdb.to](https://www.gtdb.to)
- [nyaa.si](https://nyaa.si)
- [limetorrents.to](https://www.limetorrents.to)
- [tpb.party](https://tpb.party)
- [solidtorrents.to](https://solidtorrents.to)

## Input parameters

| Parameter | Required | Description |
| - | - | - |
| query | Yes | torrent name you search for |
| scrapers | No | you can select which site you want to scrape |
| pageLimit | No | how many pages to scrape (at most), default to 1 if `minSeedsForNextPage` is not set |
| minSeedsForNextPage | No | minimum seeds each torrent needs to have in order to scrape next page |

### Input example

With this input, actor will scrape at most 3 pages on each site. If, for example, the last torrent on a second page has less than 10 seeds, the scraper will not query the next page.

```json
{
    "query": "ubuntu",
    "scrapers": [
        "thePirateBay",
        "gloTorrents",
        "limeTorrents",
        "solidTorrents"
    ],
    "pageLimit": 3,
    "minSeedsForNextPage": 10
}
```

## Output

Output is stored in a dataset, where each item contains information like `title`, `size`, `seeds` etc., but most importantly `downloadUrl` and `magnetUrl`. `downloadUrl` is a link where you can download the torrent file from. On the other hand, you don't need to download anything when using `magnetUrl`, all you need to do is to open it in your favorite torrent client. You can download the dataset extracted by Torrent Scraper in various formats such as JSON, HTML, CSV, or Excel.

### Output example (JSON)

```json
{
	"title": "debian-12.0.0-amd64-netinst.iso",
	"webUrl": "https://solidtorrents.to/torrents/debian-12-0-0-amd64-netinst-iso-0d977/6486d0ab60e0fda62643a9eb/",
	"size": "774 MB",
	"seeds": 97,
	"leeches": 175,
	"magnetUrl": "magnet:?xt=urn:btih:B851474B74F65CD19F981C723590E3E520242B97&tr=udp%3A%2F%2Ftracker.bitsearch.to%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker2.dler.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.breizh.pm%3A6969%2Fannounce&tr=udp%3A%2F%2Fwww.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&dn=%5BBitsearch.to%5D+debian-12.0.0-amd64-netinst.iso",
	"downloadUrl": "https://itorrents.org/torrent/B851474B74F65CD19F981C723590E3E520242B97.torrent?title=[Bitsearch.to]debian-12.0.0-amd64-netinst.iso",
	"origin": "https://solidtorrents.to"
}
```
