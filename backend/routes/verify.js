const cipcData = require('../data/cipc.json');
const watchlistData = require('../data/watchlist.json');

module.exports = (req, res) => {
  const { merchant } = req.body;
  
  // Find merchant in CIPC registry
  const cipcRecord = cipcData.find(m => m.name === merchant);
  
  // Check watchlist
  const watchlistRecord = watchlistData.find(m => m.name === merchant);
  
  res.json({
    status: cipcRecord?.registered ? "REGISTERED" : "UNREGISTERED",
    watchlisted: !!watchlistRecord,
    reports: watchlistRecord?.reports || 0
  });
};