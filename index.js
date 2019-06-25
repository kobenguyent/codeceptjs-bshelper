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
        if (data.status === 'passed') {
            console.log("Test has Passed");
        } else if (data.status === 'failed') {
            console.log("Test has Failed");
        }
    }

    /**
     *
     * @param sessionId Session ID for current Test browser session
     * @private
     */
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

    /**
     * Helper function gets called if the test is passing
     * @param test
     * @private
     */
    _passed(test) {
        const sessionId = this._getSessionId();
        this._updateBuild(sessionId, { 'status': 'passed', 'name': test.title });
    }

    /**
     * Helper function gets called if the test execution fails
     * @param test
     * @param error
     * @private
     */
    _failed(test, error) {
        const sessionId = this._getSessionId();
        this._updateBuild(sessionId, { 'status': 'failed', 'name': test.title });
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
}

module.exports = BrowserstackHelper;
