// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');

// const TelegramBot = require('./TelegramBot');
// const browser = require('./browser');
// const before = require('./before');
// const after = require('./after');
// const utils = require('./utils');
// const internal = require('stream');

// const url =
// 	'https://lucky-jet.gamedev-atech.cc/?exitUrl=null&language=uk&b=8137c4e5b3acab20ae1f3beb43efac9a78fcaa7c4a27cd6e8a02bf5074ba8de9857cf583774d79836cd757f40d50d77dd3b276632df2208273725233bae66c554f83a1d1981b5f2fb0b84ed7222c2f5399a3c25fb5752c3859468772cedb1166b93c6f9070.80429a59887f8724d9270af78d143b0a';

// const app = express();
// const corsOptions = {
// 	origin: [
// 		'http://localhost:5173',
// 		'https://luckyjet-ood7z7acf-oneweb1.vercel.app',
// 	],
// 	optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// let p = {};
// let coefficients = [];
// let isStart = false;

// const playersPath = 'players.json';
// const coefficientsPath = 'coefficients.json';

// const readFile = (filePath, callback) => {
// 	try {
// 		const data = fs.readFileSync(filePath, 'utf8');
// 		callback(data);
// 	} catch (e) {}
// };

// const writeFile = (filePath, data) => {
// 	fs.writeFileSync(filePath, data, 'utf8');
// };

// app.get('/', (req, res) => {
// 	res.send('Working...');
// });

// app.get('/start', async (req, res) => {
// 	await luckyParser();
// 	res.send('Working...');
// });

// app.get('/players', (req, res) => {
// 	fs.access(playersPath, fs.constants.F_OK, err => {
// 		if (err) {
// 			res.json({ message: 'Data not found' });
// 		} else {
// 			readFile(playersPath, data => {
// 				if (data) res.json(JSON.parse(data));
// 			});
// 		}
// 	});
// });

// app.get('/coefficients', (req, res) => {
// 	fs.access(coefficientsPath, fs.constants.F_OK, err => {
// 		if (err) {
// 			res.json({ message: 'Data not found' });
// 		} else {
// 			readFile(coefficientsPath, data => {
// 				if (data) res.json(JSON.parse(data));
// 			});
// 		}
// 	});
// });

// let isLockInterval = false;
// let isStarted = false;
// let roundNumber = 0;
// let unlockNumber = 0;
// const deltaTime = [new Date()];

// const luckyParser = async () => {
// 	try {
// 		const chromium = await browser.launch();

// 		const page = await browser.createPage(chromium, url);

// 		await page.waitForSelector('.fhnxTh', { timeout: 500000 });

// 		await before.initSumBets(page);

// 		let betButtons = await page.$$('.kuWarE');

// 		const randomRGBA = () => {
// 			const random = () => Math.floor(Math.random() * 150);
// 			return `rgba(${random()}, ${random()}, ${random()}, 1)`;
// 		};

// 		const interval = setInterval(async () => {
// 			if (!isLockInterval) {
// 				const date = new Date();
// 				console.log({
// 					hour: date.getHours(),
// 					minutes: date.getMinutes(),
// 					seconds: date.getSeconds(),
// 				});
// 				console.log({ roundNumber });
// 				try {
// 					isLockInterval = true;
// 					await before.roundStarted(page, betButtons);
// 					roundNumber++;

// 					//if (roundNumber >= 100) throw new Error('Reload');
// 					if (!isStart) {
// 						setTimeout(() => {
// 							page.reload();
// 						}, 5000);
// 						isStart = true;
// 					}
// 					if (roundNumber && (!isStarted || new Date() - deltaTime[0] > 6000)) {
// 						fs.access(playersPath, fs.constants.F_OK, err => {
// 							if (err) {
// 								writeFile(playersPath, JSON.stringify({}));
// 							} else {
// 								readFile(playersPath, data => {
// 									if (!Object.keys(p).length && data && JSON.parse(data)) {
// 										p = JSON.parse(data);
// 									}
// 								});
// 							}
// 						});

// 						fs.access(coefficientsPath, fs.constants.F_OK, err => {
// 							if (err) {
// 								writeFile(coefficientsPath, JSON.stringify([]));
// 							} else {
// 								readFile(coefficientsPath, data => {
// 									if (!coefficients.length && data && JSON.parse(data).length) {
// 										coefficients = [...JSON.parse(data)];
// 									}
// 								});
// 							}
// 						});

// 						await after.roundEnd(page, (player, index, length) => {
// 							const name = player.name;
// 							const date = new Date();

// 							if (!p[name] && player.name.length >= 3) {
// 								p[name] = {
// 									avatar: randomRGBA(),
// 									name,
// 									games: [],
// 								};
// 							}
// 							if (p[name]) {
// 								p[name].games.push({
// 									betNumber: player.bet,
// 									betString: player.betString,
// 									x: player.x,
// 									xNumber: player.xNumber,
// 									roundX: player.roundX,
// 									betWin: player.betWin,
// 									date: {
// 										year: date.getFullYear(),
// 										month: date.getMonth(),
// 										date: date.getDate(),
// 										day: date.getDay(),
// 										hours: date.getHours(),
// 										minutes: date.getMinutes(),
// 										seconds: date.getSeconds(),
// 									},
// 								});
// 							}
// 							if (index === length - 1) {
// 								console.log(new Date() - deltaTime[0]);
// 								coefficients.unshift(player.roundX);
// 								writeFile(coefficientsPath, JSON.stringify(coefficients));
// 								writeFile(playersPath, JSON.stringify(p));
// 								deltaTime.unshift(new Date());
// 								if (deltaTime.length > 5) deltaTime.pop();
// 								console.log(player.roundX);
// 							}
// 						});
// 						isStarted = true;
// 					}
// 				} catch (e) {
// 					console.log('client_loop: send disconnect: Connection reset');
// 					console.log(e);
// 					// utils.watchReload();
// 				}
// 				unlockNumber = 0;
// 				isLockInterval = false;
// 			}
// 		}, 1);
// 	} catch (e) {
// 		console.log(e);
// 		console.log('App crashed');
// 		// utils.watchReload();
// 	}
// };

// app.listen(3003, () => {
// 	luckyParser();
// 	console.log('Сервер запущен на порту 3000');
// });

// /*1
// Xvfb -ac :0 -screen 0 1280x1024x16 &
// export DISPLAY=:0

// pm2 start index.js --wait-ready --watch --ignore-watch="node_modules players.json coefficients.json .git/index.lock" --no-daemon
// */

const express = require('express');
const chromium = require('chrome-aws-lambda');
const axios = require('axios');
const fs = require('fs');

class TelegramBot {
	constructor(config) {
		Object.assign(this, { config });
		this.token = this.config.token;
		this.chatId = this.config.chatId;
		this.urlApi = 'https://api.telegram.org/bot' + this.token + '/sendMessage';
	}

	async sendMessage(message) {
		try {
			await axios.post(this.urlApi, {
				chat_id: this.chatId,
				parse_mode: 'html',
				text: message,
			});
			console.log('Message sent successfully:', message);
		} catch (error) {
			console.log('Error sending message:', error);
		}
	}
}

const url =
	'https://lucky-jet.gamedev-atech.cc/?exitUrl=null&language=uk&b=8137c4e5b3acab20ae1f3beb43efac9a78fcaa7c4a27cd6e8a02bf5074ba8de9857cf583774d79836cd757f40d50d77dd3b276632df2208273725233bae66c554f83a1d1981b5f2fb0b84ed7222c2f5399a3c25fb5752c3859468772cedb1166b93c6f9070.80429a59887f8724d9270af78d143b0a';

const app = express();

let interval = null;
let browser = null;

app.get('/', (req, res) => {
	res.send('Working...');
});

const launchBrowser = async () => {
	browser = await chromium.puppeteer.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-accelerated-2d-canvas',
			'--no-first-run',
			'--no-zygote',
			'--start-maximized',
			// "--single-process",
			'--disable-gpu',
			'--display=:0',
		],
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath,
		headless: 'new' || chromium.headless,
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
		await page.setDefaultNavigationTimeout(6000000);
	}

	await page.goto(url);

	return page;
};

const initSumBets = async page => {
	await page.evaluate(() => {
		const balance = 100 || (300 / 4) * 10;
		const oneBet = Math.floor((balance * 0.1) / 10) * 10;
		const twoBet = oneBet * 2;
		const betCounter = {
			one: (oneBet - 20) / 10,
			two: (twoBet - 20) / 10,
		};
		const boxes = document.querySelectorAll('.iopHCJ');
		const plus1 = boxes[0].childNodes[2];
		const plus2 = boxes[1].childNodes[2];
		const minus1 = boxes[0].childNodes[0];
		const minus2 = boxes[1].childNodes[0];
		minus1.childNodes[0].click();
		minus2.childNodes[0].click();
		console.log(betCounter.one, betCounter.two);
		for (let i = 0; i < betCounter.one; i++) {
			plus1.childNodes[0].click();
		}
		for (let i = 0; i < 1; i++) {
			plus2.childNodes[0].click();
		}
	});
};

const watchReload = () => {
	fs.writeFile('reload.json', 'reload', err => {
		if (err) {
			console.error('Error writing to file:', err);
		} else {
			console.log('Data written to file successfully.');
		}
	});
};

let isLockInterval = false;
let isNewPage = false;
let messageNumbers = 0;

const luckyParser = async () => {
	try {
		const bot = new TelegramBot({
			token: '5897805933:AAEAHBWLaEVoscocpAH82AvByBcNCp2Ojdw',
			chatId: '-1001984482139',
		});

		const browser = await launchBrowser();

		let page = await createPage(browser, url);

		await page.waitForSelector('.fhnxTh', { timeout: 500000 });

		await initSumBets(page);

		const selector = '.iMfqvu';
		let betButtons = await page.$$('.kuWarE');
		let isUatoCashout = false;

		interval = setInterval(async () => {
			const pages = await browser.pages();
			if (!isLockInterval) {
				try {
					isLockInterval = true;
					// if (!isUatoCashout) {
					// 	await page.waitForSelector(selector, { timeout: 390000 });
					// 	await page.evaluate(() => {
					// 		const inputs = document.querySelectorAll('#coef-input');
					// 		const checkboxes = document.querySelectorAll('.iJnjYA');
					// 		checkboxes[1].click();
					// 		checkboxes[3].click();
					// 		inputs.forEach(input => {
					// 			input.value = 1.5;
					// 		});
					// 	});

					// 	isUatoCashout = true;
					// }

					const skeletonSelector = '.react-loading-skeleton';

					await page.waitForSelector(skeletonSelector, { timeout: 500000 });

					const players = (await page.$$('.sc-hlzHbZ')) || [];

					await new Promise(resolve => setTimeout(resolve, 2500));

					let playerLogs = [];

					if (players.length) {
						await Promise.all(
							players.map(async (player, index) => {
								const gamer = await page.evaluate(player => {
									let name = '';
									let bet = '0';
									if (player.querySelector('.sc-gInZnl'))
										name = player.querySelector('.sc-gInZnl').innerText;
									if (player.querySelector('.sc-ACYlI'))
										bet = player.querySelector('.sc-ACYlI').innerText;
									bet = Number(bet.split('.')[0].replace(/\D/gi, ''));
									return {
										name,
										bet,
									};
								}, player);

								// console.log(`Игрок №${index} ${gamer.name} ${gamer.bet} `);
								playerLogs.push({
									name: gamer.name,
									bet: gamer.bet,
									id: index,
								});
								if (gamer.name === '@PAVLOV_EVGEN') {
									if (gamer.bet == 5000) {
										betButtons[0].click();
									} else if (gamer.bet == 10000) {
										betButtons[1].click();
									}
									const date = new Date();
									bot.sendMessage(`
					  ${gamer.name} ${gamer.bet}\n
					  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
					  `);
								}
							}),
						);
					}

					console.log('-------------------------------------------');
					const getLogMessage = array => {
						return array.length
							? array
									.map(
										player =>
											`Игрок №${player.id} ${player.name} ${player.bet}\n`,
									)
									.join('')
							: 'Wait players...';
					};

					const isSomeNames = playerLogs.some(
						player => player.name.trim().length >= 3,
					);
					const logMessage = getLogMessage(playerLogs);
					console.log({ isSomeNames });
					if (logMessage && isSomeNames) {
						bot.sendMessage(logMessage);
						messageNumbers++;
					}
					if (messageNumbers >= 100) throw new Error('Reload');

					await page.waitForFunction(
						selector => {
							const element = document.querySelector('.cTwCmb');
							return !!element;
						},
						{ timeout: 5000000 },
						selector,
					);

					if ((await pages.length) > 1) isLockInterval = false;
				} catch (e) {
					console.log('client_loop: send disconnect: Connection reset');
					console.log(e);
					watchReload();
				}
			}
		}, 1);
	} catch (e) {
		console.log(e);
		console.log('App crashed');
		console.log('Reload App');
		watchReload();
	}
};

app.listen(3003, () => {
	luckyParser();
	console.log('Сервер запущен на порту 3000');
});

//pm2 start index.js --max-restarts 3 --wait-ready

/*
Xvfb -ac :0 -screen 0 1280x1024x16 &
export DISPLAY=:0

pm2 start index.js --wait-ready --watch --ignore-watch="node_modules" --no-daemon
*/
