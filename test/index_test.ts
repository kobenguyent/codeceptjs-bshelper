import Common from "../src/lib/Common";

const sinon = require('sinon');
const { expect } = require('chai');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const bsPlugin = require('../src');

const mock = new MockAdapter(axios);

describe('Browserstack plugin config', () => {
  it('no credentials provided ', () => {
    try {
      bsPlugin();
    } catch (e) {
      expect(e.message).contain('Please provide proper Browserstack credentials');
    }
  });

  it('empty username ', () => {
    try {
      bsPlugin({
        user: '',
        key: 'test',
        shortUrl: false,
      });
    } catch (e) {
      expect(e.message).contain('Please provide proper Browserstack credentials');
    }
  });

  it('empty password ', () => {
    try {
      bsPlugin({
        user: 'test',
        key: '',
        shortUrl: false,
      });
    } catch (e) {
      expect(e.message).contain('Please provide proper Browserstack credentials');
    }
  });
});

describe('#getSessionId', () => {
  let stub;
  let bs;
  let helper;

  beforeEach(() => {
    bs = new Common();
  });

  it('should get sessionId of wd', () => {
    stub = sinon.stub(bs, 'getSessionId').callsFake(() => 'WebDriver');
    expect(bs.getSessionId(helper)).to.be.equal('WebDriver');
    stub.restore();
  });

  it('should get sessionId of Appium', () => {
    stub = sinon.stub(bs, 'getSessionId').callsFake(() => 'Appium');
    expect(bs.getSessionId(helper)).to.be.equal('Appium');
    stub.restore();
  });

  it('should throw error', () => {
    stub = sinon.stub(bs, 'getSessionId').callsFake(() => '');
    try {
      bs.getSessionId(helper);
    } catch (error) {
      expect(error.message).to.equal('No matching helper found. Supported helpers: WebDriver/Appium');
    }
  });
});


describe('#shortenUrl', () => {
  const bs = new Common();

  it('should return short url', async () => {
    const res = await bs.shortenUrl('https://thisisasuperlongtext.domain');
    expect(res).to.contain('https://tinyurl.com/');
  });
});


describe('#exposeBuildLink - with shortUrl', () => {
  const sessionId = '4567';

  mock.onGet(`/automate/sessions/${sessionId}.json`).reply(200, { automation_session: { public_url: 'http://test.link.abc' } }, {
    Authorization: 'Basic dGVzdDp0ZXN0'
  });

  let bs;
  let currentConfig;
  let defaultBsAuth;

  beforeEach(() => {
    bs = new Common();
    currentConfig = {
      user: 'test',
      key: 'test',
      shortUrl: true,
    }
    defaultBsAuth = { Authorization:  'Basic ' + btoa(currentConfig.user + ':' + currentConfig.key) };
  });

  it.skip('should return the build link', async () => {
    try {
      const res = await bs.exposeBuildLink(sessionId, currentConfig, defaultBsAuth);
    } catch (e) {
      console.log(e);
    }
  //  expect(res).to.contain('https://tinyurl.com/');
  });
});


describe('#exposeBuildLink - without shortUrl', () => {
  const sessionId = '4567';
  let bs;
  let currentConfig;
  let defaultBsAuth;

  beforeEach(() => {
    bs = new Common();
    currentConfig = {
      user: 'test',
      key: 'test',
      shortUrl: false,
    }
    defaultBsAuth = { Authorization:  'Basic ' + btoa(currentConfig.user + ':' + currentConfig.key) };

    mock.onGet(`https://api.browserstack.com/automate/sessions/${sessionId}.json`).reply(200, { automation_session: { public_url: 'http://test.link.abc' } }, {
      Authorization: defaultBsAuth
    });
  });

  it.skip('should return the build link', async () => {
    const res = await bs.exposeBuildLink(sessionId, currentConfig, defaultBsAuth);
    expect(res).to.be.equal('http://test.link');
  });
});
