// import * as feedParserService from '../services/feedParserService.js';
// import { Article } from '../models/index.js'; // Your Sequelize model

// export const syncFeedArticles = async (req, res, next) => {
//   try {
//     // req.body is already safe here because your Zod middleware ran first!
//     const { feed_url, feed_source_id } = req.body;

//     // 1. Call your parsing service to get clean data
//     const cleanedArticles = await feedParserService.fetchAndFormatFeed(feed_url, feed_source_id);

//     // 2. Use Sequelize to save them bulk style. 
//     // "updateOnDuplicate" prevents crashing if an article already exists (Upsert)
//     await Article.bulkCreate(cleanedArticles, {
//       updateOnDuplicate: ['title', 'summary', 'content_html', 'updated_at']
//     });

//     return res.status(200).json({ message: 'Feed synchronized successfully!' });
//   } catch (error) {
//     next(error); // Pass errors along to your Express global error handler
//   }
// };
