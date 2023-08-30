import {ApiHelper} from "./ApiHelper";

const tinyurl = require('tinyurl');
const output = require('../lib/output');
const api = new ApiHelper();
const bsEndpoint = 'https://api.browserstack.com';

const supportedHelpers = [
    'WebDriver',
    'Appium',
    'Playwright'
];

class Common {
    async shortenUrl (url:string) {
        try {
            return tinyurl.shorten(url);
        } catch (e) {
            output.log(e);
        }
    }

    async exposeBuildLink (sessionId:string, currentConfig:any, defaultBsAuth:any) {
        const res = await api.makeGetRequest(`${bsEndpoint}/automate/sessions/${sessionId}.json`, { ...defaultBsAuth });

        // eslint-disable-next-line max-len
        const exposedUrl = currentConfig.shortUrl ? await this.shortenUrl(res.data.automation_session.public_url) : res.data.automation_session.public_url;
        output.log(`Link to job:\n${exposedUrl}\n`);
        return exposedUrl;
    }

    async updateBuild (sessionId:string, data:any, currentConfig:any, defaultBsAuth:any) {
        if ((currentConfig.user && currentConfig.key) && (currentConfig.user !== '' && currentConfig.key !== '')) {
            await api.makePutRequest(`${bsEndpoint}/automate/sessions/${sessionId}.json`, data, { ...defaultBsAuth });
            await this.exposeBuildLink(sessionId, currentConfig, defaultBsAuth);
        } else {
            output.log('No Browserstack credentials found. Probably you are not running with Browserstack!');
        }
    }

    async getSessionId (helper:any): Promise<string> {
        if (helper.helpers.WebDriver) {
            return helper.helpers.WebDriver.browser.sessionId;
        }
        if (helper.helpers.Appium) {
            return helper.helpers.Appium.browser.sessionId;
        }
        if (helper.helpers.Playwright) {
            const { page } = helper.helpers.Playwright;

            try {
                const resp = await JSON.parse(await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'getSessionDetails'})}`));
                return resp.hashed_id;
            } catch (e) {
                output.error(e);
            }

        }
        throw new Error(`No matching helper found. Supported helpers: ${supportedHelpers.join('/')}`);
    }
}

export default Common;