# codeceptjs-bshelper
CodeceptJS Browserstack helper, to update Test Names, Test Results after execution 

codeceptjs-bshelper is [CodeceptJS](https://codecept.io/) helper which is to complete tests results on Browserstack after execution. The helper allows to update test name and
test results on Browserstack using the `_passed` and `_failed` hooks accessible in the helper.

NPM package: https://www.npmjs.com/package/codeceptjs-bshelper

### Installation
`npm install codeceptjs-bshelper --save-dev`

### Configuration

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
    },
    "REST": {}
   }
}
```
To use this helper, users must provide the Browserstack User, Key & Host as part of the configuration.

### Note
At the end, there will be an exposed URL to Browserstack. You can have the option to shorten the URL by passing this to the config

```
"shortUrl": true
```

By default, it is false due to privacy concerns, cause we still a third party lib to shorten the url. Use it as your own risk. :)