const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to a webpage
    await page.goto('https://trackcourier.io/track-and-trace/maruti-courier/MEE900170282');

    // Extract the HTML content
    const htmlContent = await page.content();
    // Load the HTML content into Cheerio
    //  $ = cheerio.load(htmlContent);
    // let htmlDOMcontent= $.html();
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    // Use Cheerio to select the desired elements
    const divElements = document.querySelectorAll('div:nth-child(2) > div:nth-child(3) > div > div:nth-child(3) > div > div > div>p>span');

    // Process and log the selected elements
   //console.log(divElements)
    divElements.forEach((pTag) => {
    const text = pTag.textContent;
    console.log(text);
  });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();

