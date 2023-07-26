# CheerioCrawler Actor template

This template is a production ready boilerplate for developing with `CheerioCrawler`. Use this to bootstrap your projects using the most up-to-date code.

> We decided to split Apify SDK into two libraries, [Crawlee](https://crawlee.dev) and [Apify SDK v3](https://docs.apify.com/sdk/js). Crawlee will retain all the crawling and scraping-related tools and will always strive to be the best web scraping library for its community. At the same time, Apify SDK will continue to exist, but keep only the Apify-specific features related to building actors on the Apify platform. Read the [upgrading guide](https://docs.apify.com/sdk/js/docs/upgrading/upgrading-to-v3) to learn about the changes.

If you're looking for examples or want to learn more visit:

- [Crawlee + Apify Platform guide](https://crawlee.dev/docs/guides/apify-platform)
- [Cheerio Tutorial](https://crawlee.dev/docs/guides/cheerio-crawler-guide)
- [Documentation](https://crawlee.dev/api/cheerio-crawler/class/CheerioCrawler)
- [Examples](https://crawlee.dev/docs/examples/cheerio-crawler)


## Getting started

For complete information [see this article](https://docs.apify.com/platform/actors/development#build-actor-locally). To run the actor use the following command:

```
apify run
```

## Deploy to Apify

### Connect Git repository to Apify

If you've created a Git repository for the project, you can easily connect to Apify:

1. Go to [Actor creation page](https://console.apify.com/actors/new)
2. Click on **Link Git Repository** button

### Push project on your local machine to Apify

You can also deploy the project on your local machine to Apify without the need for the Git repository.

1. Log in to Apify. You will need to provide your [Apify API Token](https://console.apify.com/account/integrations) to complete this action.

    ```
    apify login
    ```

2. Deploy your Actor. This command will deploy and build the Actor on the Apify Platform. You can find your newly created Actor under [Actors -> My Actors](https://console.apify.com/actors?tab=my).

    ```
    apify push
    ```

## Documentation reference

To learn more about Apify and Actors, take a look at the following resources:

- [Apify SDK for JavaScript documentation](https://docs.apify.com/sdk/js)
- [Apify SDK for Python documentation](https://docs.apify.com/sdk/python)
- [Apify Platform documentation](https://docs.apify.com/platform)
- [Join our developer community on Discord](https://discord.com/invite/jyEM2PRvMU)
