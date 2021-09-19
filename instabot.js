let loginLink = "https://www.google.com/";
let puppeteer = require("puppeteer");
let FinalArr = [];
let browserStartPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"]
});
let page, browser;
console.log("Before");
(async function () {
    try {
        let browserObj = await browserStartPromise;
        console.log("Browser opened");
        browser = browserObj
        page = await browserObj.newPage();
        console.log("new tab opened ");
        await page.goto(loginLink);
        console.log("Google home page opened");
        await page.type("input[title='Search']", "Instagram");
        await page.keyboard.press('Enter', { delay: 100 });
        await waitAndClick(".LC20lb.DKV0Md", page);
        console.log("instagram login page opened"); 
        await waitAndClick("input[name='username']", page);
        //enter username and password 
        await page.type("input[name='username']", "instabots57", { delay: 100 });
        await page.type("input[type='password']", "insta@123", { delay: 100 });
        //Login 
        await page.click('button[type="submit"]', { delay: 100 });
        console.log("instagram login complete");
        await page.waitFor(3000);
        await waitAndClick('button.sqdOP.yWX7d', page);
        await waitAndClick("input[type='text']", page);
        //type the #tag required to search 
        await page.type("input[type='text']", "#Tech", { delay: 50 });
        await page.keyboard.press('Enter', { delay: 100 });
        //await page.waitFor(2000);
        await waitAndClick('a.-qQT3', page);
        //await page.waitFor(3000);
        await page.waitForSelector('.EZdmt',{ visible: true });
        //click on the first post
        await waitAndClick('img.FFVAD', page);
        let newList = [];
        for(let i = 0;i < 5; i++){
            //await page.waitForSelector('.fr66n',{ visible: true });
            //await waitAndClick('svg[aria-label="Like"]', page);
            await page.waitForSelector(".sqdOP.yWX7d._8A5w5.ZIAjV",{ visible: true });
            let words = await page.evaluate(function(){
                let wordElem = document.querySelectorAll(".sqdOP.yWX7d._8A5w5.ZIAjV");
                let wordList = []
                wordElem.forEach(function(word){
                    wordList.push(word.innerText);
                })
                return wordList; 
            });
            //await console.log(words[0]);
            newList.push(words[0]);
            await page.waitFor(3000);
            //Go to next post
            await waitAndClick('a.coreSpriteRightPaginationArrow', page);
        }
        //console.log(newList);
        
        let linkList = [];
        for(let j = 0; j < 5;j++){
            let fullLink = `https://www.instagram.com/${newList[j]}`;
            linkList.push(fullLink);
        }
        //console.log(linkList);
        
        for(let k = 0;k < 5;k++){
        await getDataFromNewTab(linkList[k], browser, newList[k]);
        }
        console.table(FinalArr); 
        console.log("Final Table printed");
        
    } catch (err) {
        console.log(err);
    }
})();

function waitAndClick(selector, cPage) {
    return new Promise(function (resolve, reject) {
        let waitForModalPromise = cPage.waitForSelector(selector, { visible: true });
        waitForModalPromise
            .then(function () {
                let clickModal =
                    cPage.click(selector, { delay: 100 });
                return clickModal;
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err)
            })
    }
    )
}  

async function getDataFromNewTab(link, browser,name) {
    console.log("in this Link",link);
    let newPage = await browser.newPage();
    console.log("new tab opend");
    await newPage.goto(link);
    await newPage.waitForSelector("a.-nal3", { visible: true });
    await newPage.waitFor(3000);
    let followers = await newPage.evaluate(function(){
        let followerElem = document.querySelectorAll(".g47SY");
        let followerList = []
        followerElem.forEach(function(follower){
            followerList.push(follower.innerText);
        })
        return followerList; 
    });
    //await console.log(followers);
    //console.log(name);
    //console.log(followers[1],"followers");
    //console.log(followers[2],"following");
    FinalArr.push({"Name":name,"Profile Link":link , "Followers":followers[1], "Following":followers[2]});
    //await newPage.close(); 
}
