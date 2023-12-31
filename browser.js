// const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');
require('dotenv').config();

const launch = async () => {
	const browser = await puppeteer.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-accelerated-2d-canvas',
			'--no-first-run',
			'--no-zygote',
			'--start-maximized',
			// '--single-process',
			'--disable-gpu',
			'--display=:0',
		],
		defaultViewport: puppeteer.defaultViewport,
		// executablePath: await chromium.executablePath,
		executablePath:
			process.env.NODE_ENV === 'production'
				? process.env.PUPPETEER_EXECUTABLE_PATH
				: puppeteer.executablePath(),
		headless: false,
		ignoreHTTPSErrors: false,
		protocolTimeout: 1000000,
	});

	return browser;
};

const createPage = async (browser, url) => {
	const page = await browser.newPage();

	const client = await page.target().createCDPSession();
	const { width, height } = await page.evaluate(() => {
		return {
			width: window.outerWidth,
			height: window.outerHeight - 250,
		};
	});

	await client.send('Emulation.setDeviceMetricsOverride', {
		width,
		height,
		deviceScaleFactor: 1,
		mobile: false,
	});

	try {
		await page.setDefaultNavigationTimeout(6000000);
	} catch (error) {
		console.log(e);
	}
	await page.goto(url);

	return page;
};

module.exports = { launch, createPage };
