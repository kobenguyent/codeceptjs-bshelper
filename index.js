let tinyurl = require("tinyurl")

/**
 * Browserstack Helper for Codeceptjs
 *
 * @author PeterNgTr
 */
class BrowserstackHelper extends Helper {

    constructor(config) {
        super(config);
    }

    /**
     *
     * @param sessionId Session ID for current Test browser session
     * @param data      Test name, etc
     * @private
     */
    async _updateBuild(sessionId, data) {
        await this.helpers['REST']._executeRequest({
            url: `https://api.browserstack.com/automate/sessions/${sessionId}.json`,
            method: 'put',
            data: data,
            auth: {
                'username': this.config.user,
                'password': this.config.key
            }
        });

        await this._exposeBuildLink(sessionId);
    }

    /**
     *
     * @param sessionId Session ID for current Test browser session
     * @private
     */
    async _exposeBuildLink(sessionId) {
        if ((this.config.user && this.config.key) || (this.config.user !== '' && this.config.key !== '')) {
            let res = await this.helpers['REST']._executeRequest({
                url: `https://api.browserstack.com/automate/sessions/${sessionId}.json`,
                method: 'get',
                auth: {
                    'username': this.config.user,
                    'password': this.config.key
                }
            })
    
            let exposedUrl;
    
            if (this.config.shortUrl) {
                exposedUrl = await this._shortenUrl(res.data.automation_session.public_url);
            } else {
                exposedUrl = res.data.automation_session.public_url;
            }
    
            console.log(`Link to job:\n${exposedUrl}\n`);
        } else {
            console.log(`There is no provided Browserstack credentials. Probably you are not running with Browserstack!`)
        }
    }

    /**
     * Helper function gets called if the test is passing
     * @param test
     * @private
     */
    async _passed(test) {
        const sessionId = this._getSessionId();
        await this._updateBuild(sessionId, { 'status': 'passed', 'name': test.title });
    }

    /**
     * Helper function gets called if the test execution fails
     * @param test
     * @param error
     * @private
     */
    async _failed(test, error) {
        const sessionId = this._getSessionId();
        await this._updateBuild(sessionId, { 'status': 'failed', 'name': test.title, 'reason': test.err.message });
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

    async _shortenUrl(url) {
        let shortenUrl = await tinyurl.shorten(url);
        return shortenUrl;
    }
}

module.exports = BrowserstackHelper;
