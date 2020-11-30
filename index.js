const tinyurl = require('tinyurl');

const axios = require('axios');

const { event } = require('codeceptjs');

const Container = require('codeceptjs').container;

const helpers = Container.helpers();

const output = require('./lib/output');

let helper;

const supportedHelpers = [
  'WebDriver',
  'Appium',
];

for (const helperName of supportedHelpers) {
  if (Object.keys(helpers).indexOf(helperName) > -1) {
    helper = helpers[helperName];
  }
}

const defaultConfig = {
  user: '',
  key: '',
  shortUrl: false,
  enabled: false,
};

/**
 * Browserstack plugin for Codeceptjs
 *
 * @author PeterNgTr
 */
module.exports = (config) => {
  const currentConfig = Object.assign(defaultConfig, config);
  if (currentConfig.user === '' || currentConfig.password === '') throw new Error('Please provide proper Browserstack credentials');

  /**
   *
   * @param {string} url
   * @private
   *
   */
  this._shortenUrl = async function (url) {
    const shortenUrl = await tinyurl.shorten(url);
    return shortenUrl;
  };

  /**
   *
   * @param {string} sessionId Session ID for current Test browser session
   * @private
   *
   */
  this._exposeBuildLink = async function (sessionId) {
    const res = await axios({
      url: `https://api.browserstack.com/automate/sessions/${sessionId}.json`,
      method: 'get',
      auth: {
        username: currentConfig.user,
        password: currentConfig.key,
      },
    });

    let exposedUrl;

    if (currentConfig.shortUrl) {
      exposedUrl = await this._shortenUrl(res.data.automation_session.public_url);
    } else {
      exposedUrl = res.data.automation_session.public_url;
    }

    output.log(`Link to job:\n${exposedUrl}\n`);
    return exposedUrl;
  };

  /**
   *
   * @param {string} sessionId Session ID for current Test browser session
   * @param {object} data Test name, etc
   * @private
   */
  this._updateBuild = async function(sessionId, data) {
    if ((currentConfig.user && currentConfig.key) && (currentConfig.user !== '' && currentConfig.key !== '')) {
      await axios({
        url: `https://api.browserstack.com/automate/sessions/${sessionId}.json`,
        method: 'put',
        data,
        auth: {
          username: currentConfig.user,
          password: currentConfig.key,
        },
      });

      await this._exposeBuildLink(sessionId);
    } else {
      output.log('There is no provided Browserstack credentials. Probably you are not running with Browserstack!');
    }
  };

  event.dispatcher.on(event.test.passed, async (test) => {
    const sessionId = this._getSessionId();
    await this._updateBuild(sessionId, { status: 'passed', name: test.title });
  });

  event.dispatcher.on(event.test.failed, async (test, err) => {
    const sessionId = this._getSessionId();
    await this._updateBuild(sessionId, { status: 'failed', name: test.title, reason: err });
  });

  this._getSessionId = function () {
    if (helper.WebDriver) {
      return helper.WebDriver.browser.sessionId;
    }
    if (helper.Appium) {
      return helper.Appium.browser.sessionId;
    }
    throw new Error('No matching helper found. Supported helpers: WebDriver/Appium');
  };

  return this;
};
