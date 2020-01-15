[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b49908d417c34822a34b36555bcc5bc7)](https://www.codacy.com/manual/PeterNgTr/codeceptjs-bshelper?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=PeterNgTr/codeceptjs-bshelper&amp;utm_campaign=Badge_Grade) 

![npm](https://img.shields.io/npm/v/codeceptjs-bshelper?color=bright%20green)


# codeceptjs-bshelper
CodeceptJS Browserstack helper, to update Test Names, Test Results after test execution 

codeceptjs-bshelper is [CodeceptJS](https://codecept.io/) helper which is to complete tests results on Browserstack after execution. The helper allows to update test name and
test results on Browserstack using the `_passed` and `_failed` hooks accessible in the helper.

NPM package: <https://www.npmjs.com/package/codeceptjs-bshelper>

## Installation
`npm install codeceptjs-bshelper --save-dev`

## Configuration

This helper should be added in codecept.json/codecept.conf.js

Example:

```json
{
   "helpers": {
     "BrowserstackHelper": {
      "require": "codeceptjs-bshelper",
      "user": "BROWSERSTACK_USERNAME",
      "key": "BROWSERSTACK_ACCESS_KEY",
      "shortUrl": true
    }
   }
}
```
To use this helper, users must provide the Browserstack User, Key & Host as part of the configuration.

## Note
At the end, there will be an exposed URL to Browserstack. You can have the option to shorten the URL by passing this to the config

```json
"shortUrl": true
```

By default, it is false due to privacy concerns, cause we use a third party lib to shorten the url. Use it as your own risk. :)
