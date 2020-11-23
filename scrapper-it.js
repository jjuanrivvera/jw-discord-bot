const scrapeIt = require("scrape-it");

async function scrapeItExample() {
    const scrapeResult = await scrapeIt('https://wol.jw.org/wol/finder?wtlocale=S', {
      text: '#dailyText',
    });
    
    console.log(scrapeResult.data);
}

scrapeItExample();