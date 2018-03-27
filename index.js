const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello DfT!');
});

/**
 * Start server
 */
const port = 8081;
const server = app.listen(port, () => {
  console.log('listening on port %s.\n', server.address().port);
});

module.exports = app;
