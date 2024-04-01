import {PuppeteerNode} from './PuppeteerNode';

export default new PuppeteerNode();
export {Browser} from './Browser';
export type {Page} from 'puppeteer';


import puppeteer, { Browser } from 'puppeteer-extension';
import * as express from 'express';

// server for communication between browser extension and NodeJS
const app = express();
app.use(express.json());
const server = app.listen(8088);

puppeteer.launch({
	executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}).then(async (browser: Browser) => {
	// Register communication endpoint
	app.use('/api/bridge/puppeteer', browser.middleware());

	app.get('/', (req, res) => {
		res.send('GET request to the homepage')
	})

	app.get('/puppeteer', async (req, res) => {
		// do something with puppeteer
		const page = await browser.newPage();
		await page.goto('https://example.com');

		const content = await page.evaluate('document.documentElement.innerHTML');
		if(content.includes('<a')) {
			await page.click('a');
		}

		// shut everything down
		await page.close();
		res.send(content)
	})

	app.get('/close', (req, res) => {
		browser.close();
		server.close();
	})
});