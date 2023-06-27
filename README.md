[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/peternguyew)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b49908d417c34822a34b36555bcc5bc7)](https://www.codacy.com/manual/PeterNgTr/codeceptjs-bshelper?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=PeterNgTr/codeceptjs-bshelper&amp;utm_campaign=Badge_Grade)
[![GitHub tag](https://img.shields.io/github/tag/kobenguyent/codeceptjs-bshelper?include_prereleases=&sort=semver&color=green)](https://github.com/kobenguyent/codeceptjs-bshelper/releases/)

# codeceptjs-bshelper
CodeceptJS Browserstack plugin, to update Test Names, Test Results after test execution 

codeceptjs-bshelper is [CodeceptJS](https://codecept.io/) plugin which is to complete tests results on Browserstack after execution. The plugin updates test name and
test results on Browserstack using the `event.test.passed` and `event.test.failed` events.

NPM package: <https://www.npmjs.com/package/codeceptjs-bshelper>

## Installation
`npm i codeceptjs-bshelper --save-dev`

## Configuration

This plugin should be added in codecept.conf.js/codecept.conf.ts

Example:

```
{
...
   plugins: {
     BrowserstackHelper: {
      require: 'codeceptjs-bshelper',
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_ACCESS_KEY,
      shortUrl: true,
      enabled: true
    }
   }
...
}
```
To use this plugin, users must provide the Browserstack User, Key & Host as part of the configuration.

## Note
At the end, there will be an exposed URL to Browserstack. You can have the option to shorten the URL by passing this to the config

```
shortUrl: true
```

By default, it is setting to false due to *privacy concerns*, because we use a third party lib to shorten the url. Using it as your own risks. :)
