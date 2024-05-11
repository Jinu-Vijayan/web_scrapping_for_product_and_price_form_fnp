const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const xlsx = require("xlsx");

const productDetailsArray = [];

async function getDataFromSite(){
    const htmlData = await axios({
        method : "get",
        url : "https://www.fnp.com/all-cakes-lp?promo=redirectionsearch",
        headers: {
            "content-type" : "text/html"
        }
    })

    fs.writeFileSync("./webScrappedData.txt",htmlData.data)
}

// getDataFromSite();

const htmlDataFromSite = fs.readFileSync("webScrappedData.txt",{encoding: "utf-8"});

const $ = cheerio.load(htmlDataFromSite);

const products = $(".jss18").find(".products").each((index,elem)=>{
    const productName = $(elem).find(".product-card_product-title__32LFp").text();
    const productPrice = $(elem).find(".product-card_product-desc-tile__10UVW").find(".product-card_product-price-info-container__E9rQf").find(".product-card_product-price-info__17tj7").text();

    const productDetails = {
        productName : productName,
        productPrice : productPrice
    }

    productDetailsArray.push(productDetails);
});
console.log(productDetailsArray)

const workBook = xlsx.utils.book_new();
const workSheet = xlsx.utils.json_to_sheet(productDetailsArray);

xlsx.utils.book_append_sheet(workBook,workSheet,"sheet1");
xlsx.writeFile(workBook,"product.xlsx");