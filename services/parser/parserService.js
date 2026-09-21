//! Feed URL Validator 

const Parser = require('rss-parser');

//  BYPASSING THE 406 REJECTION - EX: PEERTUBE ASKS FOR USERAGENT 
const parser = new Parser({
  requestOptions: {
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.1',
      'User-Agent': 'AnAtomixRSSReader/1.0 (+http://localhost:5173/)'
    }
  }
});

// SEQUELIZE

const db = require('../../models/configDB.js');

const parserService = {

  // EXPOSING THE RAW PARSER LINK QUERY FOR THE CONTROLLER TO RUN ANALYSIS NATIVELY

  parseURL: async (feedUrl) => {
    try {
      return await parser.parseURL(feedUrl);
    } catch (err) {
      throw new Error(err.message);
    }
  },

  /**
   * Reads an online RSS URL, extracts articles, and saves them to the DB
   * @param {number} feedSourceId - The ID of the parent feed source
   * @param {string} feedUrl - The online URL of the RSS feed
   */

  syncArticlesForSource: async (feedSourceId, feedUrl) => {
    try {
      console.log(`Bot reading RSS feed: ${feedUrl}`);

      // Fetch and parse the live XML data from the internet

      const feedContents = await parser.parseURL(feedUrl);

      // Loop through every individual article item found in the feed

      for (const item of feedContents.items) {

        // Compute a fallback unique GUID identifier if the RSS item doesn't provide one
        // DB requires a GUID string, using the article link = safe backup

        const itemGuid = item.guid || item.id || item.link;

        if (!itemGuid) {
          console.log("⚠️ Skipping an article because it has no link, ID, or GUID.");
          continue;
        }

        // Prevent duplicates: Check if this article GUID already exists in our table

        const alreadyExists = await db.feedArticle.findOne({
          where: { guid: itemGuid }
        });

        if (!alreadyExists) {

          // 4. Save the item using exact table column names

          await db.feedArticle.create({

            feed_source_id: feedSourceId,

            guid: itemGuid,
            link: item.link || '',
            title: item.title || 'Untitled Article',

            // Map RSS parser content keys to model's 'summary' and 'content_html'

            summary: item.contentSnippet || item.summary || null,
            content_html: item.content || null,

            author: item.creator || item.author || null,

            // Convert the RSS string date (e.g. "Fri, 18 Sep 2026...") into a real DB Date object

            published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
            updated_at: item.isoDate ? new Date(item.isoDate) : new Date()
          });

          console.log(`Saved new article: "${item.title}"`);
        }
      }

      return true;
    } catch (error) {
      console.error("Failed to parse or save RSS data:", error.message);
      return false;
    }
  }
};


module.exports = parserService;