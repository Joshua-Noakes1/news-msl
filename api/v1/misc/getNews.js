const { parse } = require('rss-to-json');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
    try {
        var news = [];
        var skyNews = await parse('https://feeds.skynews.com/feeds/rss/home.xml');
        var bbcNews = await parse('http://feeds.bbci.co.uk/news/rss.xml');

        // loop over each feed and add to news array
        skyNews.items.forEach((item) => {
            news.push({
                id: uuidv4(),
                title: item.title,
                link: item.link.toString().split("?")[0], // remove query string from link eg. UTM tracking
                description: item.description,
                pubDate: item.created,
                source: 'Sky News',
                color: "rgb(0, 161, 228)"
            });
        });
        bbcNews.items.forEach((item) => {
            news.push({
                id: uuidv4(),
                title: item.title,
                link: item.link.toString().split("?")[0], // remove query string from link eg. UTM tracking
                description: item.description,
                pubDate: item.created,
                source: 'BBC News',
                color: "rgb(187, 25, 25)"
            });
        });

        // sort news by date (newest first)
        news.sort((a, b) => {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        });

        // return news
        return res.status(200).json({
            status: true,
            news: news
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
}