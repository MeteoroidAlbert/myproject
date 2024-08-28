const express = require('express');
const request = require('request');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle requests
app.use((req, res) => {
  // Construct the API URL from request URL
  const apiUrl = 'https://newsapi.org/v2/everything' + req.url;

  // Forward the request to the News API
  req.pipe(request(apiUrl)).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});