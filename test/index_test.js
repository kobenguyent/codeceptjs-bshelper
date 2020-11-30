const sinon = require('sinon');
const { expect } = require('chai');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const bsPlugin = require('../index.js');

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

describe('#_getSessionId', () => {
  let stub;
  let bs;
  beforeEach(() => {
    bs = bsPlugin({
      user: 'test',
      key: 'test',
      shortUrl: false,
    });
  });

  it('should get sessionId of wd', () => {
    stub = sinon.stub(bs, '_getSessionId').callsFake(() => 'WebDriver');
    expect(bs._getSessionId()).to.be.equal('WebDriver');
    stub.restore();
  });

  it('should get sessionId of Appium', () => {
    stub = sinon.stub(bs, '_getSessionId').callsFake(() => 'Appium');
    expect(bs._getSessionId()).to.be.equal('Appium');
    stub.restore();
  });

  it('should throw error', () => {
    stub = sinon.stub(bs, '_getSessionId').callsFake(() => '');
    try {
      bs._getSessionId();
    } catch (error) {
      expect(error.message).to.equal('No matching helper found. Supported helpers: WebDriver/Appium');
    }
  });
});

describe('#_shortenUrl', () => {
  const bs = bsPlugin({
    user: 'test',
    key: 'test',
    shortUrl: false,
  });

  it('should return short url', async () => {
    const res = await bs._shortenUrl('https://thisisasuperlongtext.domain');
    expect(res).to.contain('https://tinyurl.com/');
  });
});

describe('#_exposeBuildLink - with shortUrl', () => {
  const sessionId = '4567';
  mock.onGet(`https://api.browserstack.com/automate/sessions/${sessionId}.json`).reply(200, { automation_session: { public_url: 'http://test.link.abc' } });
  let bs;

  beforeEach(() => {
    bs = bsPlugin({
      user: 'test',
      key: 'test',
      shortUrl: true,
    });
  });

  it('should return the build link', async () => {
    const res = await bs._exposeBuildLink(sessionId);
    expect(res).to.contain('https://tinyurl.com/');
  });
});

describe('#_exposeBuildLink - without shortUrl', () => {
  const sessionId = '4567';
  mock.onGet(`https://api.browserstack.com/automate/sessions/${sessionId}.json`).reply(200, { automation_session: { public_url: 'http://test.link' } });
  let bs;

  beforeEach(() => {
    bs = bsPlugin({
      user: 'test',
      key: 'test',
      shortUrl: false,
    });
  });

  it('should return the build link', async () => {
    const res = await bs._exposeBuildLink(sessionId);
    expect(res).to.be.equal('http://test.link');
  });
});
