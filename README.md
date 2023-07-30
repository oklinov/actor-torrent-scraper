# Torrent Scraper

This scraper collects torrents from various torrent sites like [limetorrents.to](https://www.limetorrents.to) or [tpb.party](https://tpb.party).

## Input parameters

At this moment, the actor has only one input parameter: `query` - torrent name you search for.

### Input example

```
{
    "query": "debian"
}
```

## Output

Output is stored in a dataset, where each item contains information like `title`, `size`, `seeds` etc., but most importantly `downloadUrl` and `magnetUrl`. `downloadUrl` is a link where you can download the torrent file from. On the other hand, you don't need to download anything when using `magnetUrl`, all you need to do is to open it in your favorite torrent client. You can download the dataset extracted by Torrent Scraper in various formats such as JSON, HTML, CSV, or Excel.

### Output example (JSON)

```
{
	"title": "debian-12.0.0-amd64-netinst.iso",
	"webUrl": "https://solidtorrents.to/torrents/debian-12-0-0-amd64-netinst-iso-0d977/6486d0ab60e0fda62643a9eb/",
	"size": "774 MB",
	"seeds": "97",
	"leeches": "175",
	"magnetUrl": "magnet:?xt=urn:btih:B851474B74F65CD19F981C723590E3E520242B97&tr=udp%3A%2F%2Ftracker.bitsearch.to%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker2.dler.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.breizh.pm%3A6969%2Fannounce&tr=udp%3A%2F%2Fwww.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&dn=%5BBitsearch.to%5D+debian-12.0.0-amd64-netinst.iso",
	"downloadUrl": "https://itorrents.org/torrent/B851474B74F65CD19F981C723590E3E520242B97.torrent?title=[Bitsearch.to]debian-12.0.0-amd64-netinst.iso",
	"origin": "https://solidtorrents.to"
}
```
