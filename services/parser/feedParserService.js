// import Parser from 'rss-parser';
// const parser = new Parser();

// export const fetchAndFormatFeed = async (feedUrl, feedSourceId) => {
//   // 1. Download the RSS/Atom XML from the internet
//   const feed = await parser.parseURL(feedUrl);
  
//   // 2. Clean it up and shape it to look exactly like your database columns
//   return feed.items.map((item) => ({
//     guid: item.id || item.guid || item.link,
//     link: item.link,
//     title: item.title,
//     summary: item.summary || item.contentSnippet || null,
//     content_html: item['content:encoded'] || item.content || null,
//     author: item.creator || item.author || feed.author || null,
//     published_at: item.isoDate || item.pubDate || new Date(),
//     updated_at: item.isoDate || new Date(),
//     feed_source_id: feedSourceId
//   }));
// };

// Feed URL Validator +  To check the user's input request.Article Model?  To save the parsed articles into PostgreSQL (already done) - must come after parsing then.