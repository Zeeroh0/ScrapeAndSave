const request = require("request"),
	cheerio = require("cheerio");


// console.log("\n******************************************\n" +
//             "Hit www.nytimes.com and tag each article element\n"+
//             "with .theme-summary.  For each of those article elements,\n"+
//             "grab the children for the headline and summary.\n"+
//             "\n******************************************\n");

const scrape = (cb) => {
	request("http://www.nytimes.com", (err, response, html) => {
		if (err) throw err;

		let $ = cheerio.load(html);
		let articles = [];
	
		$(".theme-summary").each((i, el) => {
			let head = $(el).children(".story-heading").text().trim();
			let sum = $(el).children(".summary").text().trim();
			let url = $(el).children(".story-heading").children().attr("href");

			if (head &&  sum) {
				let headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
				let sumeNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

				let dataToAdd = {
					headline: headNeat,
					summary: sumeNeat,
					url
				};

				articles.push(dataToAdd);
			}
		});

		cb(articles);

	});
};

// const someFunc = (art) => console.log(art);
// scrape(someFunc);


module.exports = scrape;
