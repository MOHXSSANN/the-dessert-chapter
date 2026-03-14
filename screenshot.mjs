import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const dir = './temporary screenshots';

if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter(f => /^screenshot-\d+/.test(f));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const filepath = `${dir}/${filename}`;

const chromePaths = [
  'C:/Users/Moham/.cache/puppeteer/chrome/win64-146.0.7680.66/chrome-win64/chrome.exe',
  'C:/Users/Moham/.cache/puppeteer/chrome/win64-131.0.6778.204/chrome-win64/chrome.exe',
  'C:/Users/nateh/.cache/puppeteer/chrome/win64-131.0.6778.204/chrome-win64/chrome.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];

import { existsSync as exists } from 'fs';
const executablePath = chromePaths.find(p => exists(p));

const browser = await puppeteer.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.screenshot({ path: filepath, fullPage: true });
await browser.close();
console.log(`Saved: ${filepath}`);
