const puppeteer = require('puppeteer');
const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const dbPath = path.resolve(__dirname, 'db.sqlite')
// open the database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }else{
        console.log('Connected to the chinook database.');
        db.run('CREATE TABLE emlak (il TEXT, ilce TEXT, mahalle TEXT, ada TEXT, imar TEXT, tasinmazMt TEXT, hazineMt TEXT, satilacakMt TEXT, bedel TEXT, teminat TEXT, tarih TEXT)')
    }
});



(async () => {


    let array = fs.readFileSync('list.txt').toString().split("\n");
    for(let i in array) {
        let url = array[i];
        // set some options (set headless to false so we can see
        // this automated browsing experience)
        let launchOptions = { headless: false, args: ['--start-maximized'] };

        const browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        // set viewport and user agent (just in case for nice viewing)
        await page.setViewport({width: 1366, height: 768});
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

        // go to the target web
        await page.goto(url);

        // wait for element defined by XPath appear in page
        await page.waitForXPath("(//h1[@class='title'])");

        // evaluate XPath expression of the target selector (it return array of ElementHandle)
        let ilHandle = await page.$x("(/html/body/div[7]/div[2]/div[1]/div/div[1]/ul[2]/li[2]/text())");
        let il = await page.evaluate(el => el.textContent, ilHandle[0]);

        let ilceHandle = await page.$x("(/html/body/div[7]/div[2]/div[1]/div/div[1]/ul[2]/li[3]/text())");
        let ilce = await page.evaluate(el => el.textContent, ilceHandle[0]);

        let mahalleHandle = await page.$x("(/html/body/div[7]/div[2]/div[1]/div/div[1]/ul[2]/li[4]/text())");
        let mahalle = await page.evaluate(el => el.textContent, mahalleHandle[0]);

        let adaHandle = await page.$x("(/html/body/div[7]/div[2]/div[2]/div/div[1]/div[2]/ul/li[2]/span[2]/text())");
        let ada = await page.evaluate(el => el.textContent, adaHandle[0]);

        let imarHandle = await page.$x("(/html/body/div[7]/div[2]/div[2]/div/div[1]/div[2]/ul/li[3]/span[2]/text())");
        let imar = await page.evaluate(el => el.textContent, imarHandle[0]);

        let tasinmazMtHandle = await page.$x("(/html/body/div[7]/div[2]/div[2]/div/div[1]/div[2]/ul/li[7]/span[2]/text())");
        let tasinmazMt = await page.evaluate(el => el.textContent, tasinmazMtHandle[0]);

        let hazineMtHandle = await page.$x("(/html/body/div[7]/div[2]/div[2]/div/div[1]/div[2]/ul/li[8]/span[2]/text())");
        let hazineMt = await page.evaluate(el => el.textContent, hazineMtHandle[0]);

        let satilacakMtHandle = await page.$x("(/html/body/div[7]/div[2]/div[2]/div/div[1]/div[2]/ul/li[9]/span[2]/text())");
        let satilacakMt = await page.evaluate(el => el.textContent, satilacakMtHandle[0]);

        let bedelHandle = await page.$x("(/html/body/div[7]/div[2]/div[2]/div/div[1]/div[2]/ul/li[10]/span[2]/text())");
        let bedel = await page.evaluate(el => el.textContent, bedelHandle[0]);

        let teminatHandle = await page.$x("(/html/body/div[7]/div[2]/div[2]/div/div[1]/div[2]/ul/li[11]/span[2]/text())");
        let teminat = await page.evaluate(el => el.textContent, teminatHandle[0]);

        let tarihHandle = await page.$x("(/html/body/div[7]/div[2]/div[2]/div/div[1]/div[2]/ul/li[12]/span[2]/text())");
        let tarih = await page.evaluate(el => el.textContent, tarihHandle[0]);


        console.log('il:', il);
        console.log('ilce:', ilce);
        console.log('mahalle:', mahalle);
        console.log('ada:', ada);
        console.log('imar:', imar);
        console.log('tasinmazMt:', tasinmazMt);
        console.log('hazineMt:', hazineMt);
        console.log('satilacakMt:', satilacakMt);
        console.log('bedel:', bedel);
        console.log('teminat:', teminat);
        console.log('tarih:', tarih);



        db.run(`INSERT INTO emlak(il, ilce, mahalle, ada, imar, tasinmazMt, hazineMt, satilacakMt, bedel, teminat, tarih) VALUES(?,?,?,?,?,?,?,?,?,?,?)`, [il, ilce, mahalle, ada, imar, tasinmazMt, hazineMt, satilacakMt, bedel, teminat, tarih], function(err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });

        // close the browser
        await browser.close();

    }
})();
