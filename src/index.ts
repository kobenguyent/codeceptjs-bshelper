import  Common from "./lib/Common";
const common = new Common();
const { event, container } = require('codeceptjs');
const helpers = container.helpers();

const supportedHelpers = [
  'WebDriver',
  'Appium',
  'Playwright'
];

let helper;
let sessionId;

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

const ERROR: string = 'Please provide proper Browserstack credentials';

module.exports = (config) => {
  const currentConfig = Object.assign(defaultConfig, config);

  if (!currentConfig.user || !currentConfig.key) throw new Error(ERROR);
  if (currentConfig.user === '' || currentConfig.key === '') throw new Error(ERROR);

  const defaultBsAuth = { Authorization:  'Basic ' + btoa(currentConfig.user + ':' + currentConfig.key) };

  event.dispatcher.on(event.test.started, async (test) => {
    sessionId = await common.getSessionId(helper);
  });

  event.dispatcher.on(event.test.passed, async (test) => {
    await common.updateBuild(sessionId, { status: 'passed', name: test.title }, currentConfig, defaultBsAuth);
  });

  event.dispatcher.on(event.test.failed, async (test, err) => {
    await common.updateBuild(sessionId, { status: 'failed', name: test.title, reason: err.message }, currentConfig, defaultBsAuth);
  });

  return this;
};
