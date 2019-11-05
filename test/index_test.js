const sinon = require('sinon');
const { expect } = require('chai');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

// Required to avoid class undefined errors when initializing our helper
global.Helper = require('codeceptjs').helper;

const BrowserstackHelper = require('../index.js');

describe('#_getSessionId', () => {
  let stub;
  let bsHelper;

  beforeEach(() => {
    bsHelper = new BrowserstackHelper();
  });

  it('should get sessionId of wd', () => {
    stub = sinon.stub(bsHelper, '_getSessionId').callsFake(() => 'WebDriver');
    expect(bsHelper._getSessionId()).to.be.equal('WebDriver');
    stub.restore();
  });

  it('should get sessionId of Appium', () => {
    stub = sinon.stub(bsHelper, '_getSessionId').callsFake(() => 'Appium');
    expect(bsHelper._getSessionId()).to.be.equal('Appium');
    stub.restore();
  });

  it('should get sessionId of wdio', () => {
    stub = sinon.stub(bsHelper, '_getSessionId').callsFake(() => 'WebDriverIO');
    expect(bsHelper._getSessionId()).to.be.equal('WebDriverIO');
  });

  it('should throw error', () => {
    stub = sinon.stub(bsHelper, '_getSessionId').callsFake(() => '');
    try {
      bsHelper._getSessionId();
    } catch (error) {
      expect(error.message).to.equal('No matching helper found. Supported helpers: WebDriver/Appium/WebDriverIO');
    }
  });
});

describe('#_shortenUrl', () => {
  let bsHelper;

  beforeEach(() => {
    bsHelper = new BrowserstackHelper();
  });

  it('should return short url', async () => {
    const res = await bsHelper._shortenUrl('https://thisisasuperlongtext.domain');
    expect(res).to.contain('http://tinyurl.com/');
  });
});

describe('#_exposeBuildLink', () => {
  let bsHelper;
  const sessionId = '1234';
  mock.onGet(`https://api.browserstack.com/automate/sessions/${sessionId}.json`).reply(200, { automation_session: { public_url: 'http://test.link' } });

  describe('without shortUrl', () => {
    beforeEach(() => {
      bsHelper = new BrowserstackHelper({ user: 'test', key: 'test' });
    });

    it('should return the build link', async () => {
      const res = await bsHelper._exposeBuildLink(sessionId);
      expect(res).to.be.equal('http://test.link');
    });
  });

  describe('with shortUrl', () => {
    beforeEach(() => {
      bsHelper = new BrowserstackHelper({ user: 'test', key: 'test', shortUrl: true });
    });

    it('should return the build link', async () => {
      const res = await bsHelper._exposeBuildLink(sessionId);
      expect(res).to.contain('http://tinyurl.com/');
    });
  });
});
