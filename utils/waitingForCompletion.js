const { Idempotency } = require('../models/idempotenty-model');

const POLL_INTERVAL = 200;
const POLL_TIMEOUT = 3000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
async function waitingForCompletion(key) {
  const start = Date.now();
  while (true) {
    // Timeout if expires;
    if (Date.now() - start > POLL_TIMEOUT) return null;
    const record = await Idempotency.findOne({ key });

    if (record?.status === 'completed') {
      return record;
    }

    await sleep(POLL_INTERVAL);
  }
}

module.exports = { waitingForCompletion };
