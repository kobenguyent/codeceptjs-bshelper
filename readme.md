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
      "key": "BROWSERSTACK_ACCESS_KEY"
    },
    "REST": {}
   }
}
```
To use this helper, users must provide the Browserstack User, Key & Host as part of the configuration.
