const cron = require('node-cron');

const feedSourceService = require('../feedSourceService.js');

// WAKE UP AUTOMATICALLY EVERY HOUR (0 * * * *)

cron.schedule('0 * * * *', async () => {

  console.log('CRON STARTED: PARSING LATEST STREAM XML FEEDS');

  try {

    // CALLING SYNC FUNCTION TO DL FRESH ARTICLES

    await feedSourceService.syncAllActiveFeeds();

  } catch (err) {

    console.error('💥 CRON SERVER REJECTION:', err.message);
  }
});