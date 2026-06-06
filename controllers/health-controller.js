const mongoose = require('mongoose');

function healthController(req, res) {
  const dbState = mongoose.connection.readyState;
  console.log('dbState', dbState);

  const dbStatus = {
    0: 'disconnected',
    1: 'connnected',
    2: 'connecting',
    3: 'disconnected',
  }[dbState];

  const isHealth = dbState === 1;

  return res.status(isHealth ? 200 : 503).json({
    status: isHealth ? 'ok' : 'disregarded',
    server: 'running',
    databaseStatus: dbStatus,
    timeStamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
}

module.exports = { healthController };
