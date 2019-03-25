const sinon = require('sinon');
const expect = require('chai').expect;

let bsHelper;
let stub;

describe('#_getSessionId', () => {
    describe('webdriver', () => {
        before(() => {
            class Helper {
                constructor() {
                    this.helpers = { 'WebDriver': { browser: { sessionId: 'WebDriver' } } };
                }
            }
            
            class BrowserstackHelper extends Helper {
                constructor() {
                    super();
                }
            
                _getSessionId() {
                    if (this.helpers['WebDriver']) {
                        return this.helpers['WebDriver'].browser.sessionId;
                    }
                    if (this.helpers['Appium']) {
                        return this.helpers['Appium'].browser.sessionId;
                    }
                    if (this.helpers['WebDriverIO']) {
                        return this.helpers['WebDriverIO'].browser.requestHandler.sessionID;
                    }
                    throw new Error('No matching helper found. Supported helpers: WebDriver/Appium/WebDriverIO');
                }
            };
    
            bsHelper = new BrowserstackHelper();
            stub = sinon.stub();
        });
    
        it('should get sessionId of wd', () => {
            stub(bsHelper, '_getSessionId');
            expect(bsHelper._getSessionId()).to.be.equal('WebDriver');
        });
    });

    describe('appium', () => {
        before(() => {
            class Helper {
                constructor() {
                    this.helpers = { 'Appium': { browser: { sessionId: 'Appium' } } };
                }
            }
            
            class BrowserstackHelper extends Helper {
                constructor() {
                    super();
                }
            
                _getSessionId() {
                    if (this.helpers['WebDriver']) {
                        return this.helpers['WebDriver'].browser.sessionId;
                    }
                    if (this.helpers['Appium']) {
                        return this.helpers['Appium'].browser.sessionId;
                    }
                    if (this.helpers['WebDriverIO']) {
                        return this.helpers['WebDriverIO'].browser.requestHandler.sessionID;
                    }
                    throw new Error('No matching helper found. Supported helpers: WebDriver/Appium/WebDriverIO');
                }
            };
    
            bsHelper = new BrowserstackHelper();
            stub = sinon.stub();
        });
    
        it('should get sessionId of Appium', () => {
            stub(bsHelper, '_getSessionId');
            expect(bsHelper._getSessionId()).to.be.equal('Appium');
        });
    });

    describe('wdio', () => {
        before(() => {
            class Helper {
                constructor() {
                    this.helpers = { 'WebDriverIO': { browser: { requestHandler : { sessionID: 'WebDriverIO' } }} };
                }
            }
            
            class BrowserstackHelper extends Helper {
                constructor() {
                    super();
                }
            
                _getSessionId() {
                    if (this.helpers['WebDriver']) {
                        return this.helpers['WebDriver'].browser.sessionId;
                    }
                    if (this.helpers['Appium']) {
                        return this.helpers['Appium'].browser.sessionId;
                    }
                    if (this.helpers['WebDriverIO']) {
                        return this.helpers['WebDriverIO'].browser.requestHandler.sessionID;
                    }
                    throw new Error('No matching helper found. Supported helpers: WebDriver/Appium/WebDriverIO');
                }
            };
    
            bsHelper = new BrowserstackHelper();
            stub = sinon.stub();
        });
    
        it('should get sessionId of wdio', () => {
            stub(bsHelper, '_getSessionId');
            expect(bsHelper._getSessionId()).to.be.equal('WebDriverIO');
        });
    });

    describe('no matching helper', () => {
        before(() => {
            class Helper {
                constructor() {
                    this.helpers = { };
                }
            }
            
            class BrowserstackHelper extends Helper {
                constructor() {
                    super();
                }
            
                _getSessionId() {
                    if (this.helpers['WebDriver']) {
                        return this.helpers['WebDriver'].browser.sessionId;
                    }
                    if (this.helpers['Appium']) {
                        return this.helpers['Appium'].browser.sessionId;
                    }
                    if (this.helpers['WebDriverIO']) {
                        return this.helpers['WebDriverIO'].browser.requestHandler.sessionID;
                    }
                    throw new Error('No matching helper found. Supported helpers: WebDriver/Appium/WebDriverIO');
                }
            };
    
            bsHelper = new BrowserstackHelper();
            stub = sinon.stub();
        });
    
        it('should throw error', () => {
            stub(bsHelper, '_getSessionId');
            try {
                bsHelper._getSessionId()
            } catch (error) {
                expect(error.message).to.equal('No matching helper found. Supported helpers: WebDriver/Appium/WebDriverIO');
            }
        });
    });
});

describe('#_exposeBuildLink', () => {
    before(() => {
        class Helper {
            constructor() {
                this.helpers = { 'REST': { _executeRequest() {return Promise.resolve({data : { automation_session : {public_url : 'https://test.test' }}})} } };
                this.config = { user: 'user', key: 'key'};
            }
        }
        
        class BrowserstackHelper extends Helper {
            constructor() {
                super();
            }

            _exposeBuildLink(sessionId) {
                this.helpers['REST']._executeRequest({
                    url: `https://api.browserstack.com/automate/sessions/${sessionId}.json`,
                    method: 'get',
                    auth: {
                        'username': this.config.user,
                        'password': this.config.key
                    }
                }).then(res => {
                    const bs_url = `Test finished. Link to job: ${res.data.automation_session.public_url}`;
                    console.log(bs_url);
                });
            }
        };

        bsHelper = new BrowserstackHelper();
        stub = sinon.stub();
    });

    it('should print the link to job', () => {
        stub(bsHelper, '_exposeBuildLink');
        bsHelper._exposeBuildLink('123');
    });
});

describe('#_updateBuild', () => {
    before(() => {
        class Helper {
            constructor() {
                this.helpers = { 'REST': { _executeRequest() {return Promise.resolve({data : { automation_session : {public_url : 'https://test.test' }}})} } };
                this.config = { user: 'user', key: 'key'};
            }
        }
        
        class BrowserstackHelper extends Helper {
            constructor() {
                super();
            }

            _exposeBuildLink(sessionId) {
                this.helpers['REST']._executeRequest({
                    url: `https://api.browserstack.com/automate/sessions/${sessionId}.json`,
                    method: 'get',
                    auth: {
                        'username': this.config.user,
                        'password': this.config.key
                    }
                }).then(res => {
                    const bs_url = `Test finished. Link to job: ${res.data.automation_session.public_url}`;
                    console.log(bs_url);
                });
            }

            _updateBuild(sessionId, data) {
                this.helpers['REST']._executeRequest({
                    url: `https://api.browserstack.com/automate/sessions/${sessionId}.json`,
                    method: 'put',
                    data: data,
                    auth: {
                        'username': this.config.user,
                        'password': this.config.key
                    }
                });
        
                this._exposeBuildLink(sessionId);
            }
        };

        bsHelper = new BrowserstackHelper();
        stub = sinon.stub();
    });

    it('should print the link to job after the build updating', () => {
        stub(bsHelper, '_updateBuild');
        bsHelper._updateBuild('123', {test: 'test'});
    });
});