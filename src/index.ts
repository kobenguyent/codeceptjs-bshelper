import {supportedHelpers, Common} from "./lib/Common";
const common = new Common();
const { event, container } = require('codeceptjs');
const helpers = container.helpers();

let helper;

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

module.exports = (config) => {
  const currentConfig = Object.assign(defaultConfig, config);

  if (currentConfig.user === '' || currentConfig.password === '') throw new Error('Please provide proper Browserstack credentials');

  const defaultBsAuth = { auth: { username: currentConfig.user, password: currentConfig.key } };

  event.dispatcher.on(event.test.passed, async (test) => {
    const sessionId = common.getSessionId(helper);
    await common.updateBuild(sessionId, { status: 'passed', name: test.title }, currentConfig, defaultBsAuth);
  });

  event.dispatcher.on(event.test.failed, async (test, err) => {
    const sessionId = common.getSessionId(helper);
    await common.updateBuild(sessionId, { status: 'failed', name: test.title, reason: err.message }, currentConfig, defaultBsAuth);
  });

  return this;
};
