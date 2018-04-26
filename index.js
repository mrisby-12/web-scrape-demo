const puppeteer = require("puppeteer");
const fs = require("fs");

const sleep = require(`${__dirname}/utils`);

const writeToFile = data => {
  fs.writeFile("./data.json", JSON.stringify(data), err => {
    if (err) return console.error(err);
    process.exit();
  });
};

(async () => {
  const data = [];
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://en.wikipedia.org/wiki/Main_Page");
  await sleep(page, 60000);

  for (let i = 0; i < 10; i++) {
    await page.click("#n-randompage");
    const paragraphs = await page.$$("#content p");
    const titleNode = await page.$('#firstHeading')
    const title = await (await titleNode.getProperty('innerText')).jsonValue()
    const pageObj = {
      title,
      paragraphs: []
    }
    for (let j = 0; j < paragraphs.length; j++) {
      pageObj.paragraphs.push({
        p: await (await paragraphs[j].getProperty("innerText")).jsonValue()
      });
    }
    data.push(pageObj)
  }
  writeToFile(data);
})();

//to pass to express

// const express = require('express')

// const app = 'express'

// applicationCache.get('/api/wikidata', (req, res) => {
//   fs.readFile('./data.json', 'utf8', (err, file) => {
//     if (err) {
//       res.status(500).json(err)
//     } else {
//       res.status(200).json(JSON.parse(file))
//     }
//   })
// })
