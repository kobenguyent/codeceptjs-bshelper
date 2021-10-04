const tinyurl = require('tinyurl');
const axios = require('axios').default;
const { event } = require('codeceptjs');
const { container } = require('codeceptjs');

const helpers = container.helpers();
const output = require('./lib/output');

const bsEndpoint = 'https://api.browserstack.com';

let helper;

const supportedHelpers = [
  'WebDriver',
  'Appium',
];

// eslint-disable-next-line no-restricted-syntax
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

  const defaultBsAuth = { auth: { username: currentConfig.user, password: currentConfig.key } };

  /**
   *
   * @param {string} url
   * @private
   *
   */

  this._shortenUrl = function (url) {
    try {
      return tinyurl.shorten(url);
    } catch (e) {
      output.log(e);
    }
  };

  /**
   *
   * @param {string} sessionId Session ID for current Test browser session
   * @private
   *
   */
  this._exposeBuildLink = async function (sessionId) {
    const res = await axios.get(`${bsEndpoint}/automate/sessions/${sessionId}.json`, { ...defaultBsAuth });

    // eslint-disable-next-line max-len
    const exposedUrl = currentConfig.shortUrl ? this._shortenUrl(res.data.automation_session.public_url) : res.data.automation_session.public_url;
    output.log(`Link to job:\n${exposedUrl}\n`);
    return exposedUrl;
  };

  /**
   *
   * @param {string} sessionId Session ID for current Test browser session
   * @param {object} data Test name, etc
   * @private
   */
  this._updateBuild = async function (sessionId, data) {
    if ((currentConfig.user && currentConfig.key) && (currentConfig.user !== '' && currentConfig.key !== '')) {
      await axios.put(`${bsEndpoint}/automate/sessions/${sessionId}.json`, data, { ...defaultBsAuth });
      await this._exposeBuildLink(sessionId);
    } else {
      output.log('No Browserstack credentials found. Probably you are not running with Browserstack!');
    }
  };

  event.dispatcher.on(event.test.passed, async (test) => {
    const sessionId = this._getSessionId();
    await this._updateBuild(sessionId, { status: 'passed', name: test.title });
  });

  event.dispatcher.on(event.test.failed, async (test, err) => {
    const sessionId = this._getSessionId();
    await this._updateBuild(sessionId, { status: 'failed', name: test.title, reason: err.message });
  });

  this._getSessionId = function () {
    if (helper.helpers.WebDriver) {
      return helper.helpers.WebDriver.browser.sessionId;
    }
    if (helper.helpers.Appium) {
      return helper.helpers.Appium.browser.sessionId;
    }
    throw new Error(`No matching helper found. Supported helpers: ${supportedHelpers.join('/')}`);
  };

  return this;
};
