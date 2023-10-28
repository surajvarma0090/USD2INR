const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');

const app = express();
const port = 3000; // You can choose any available port

// Set up a static directory to serve files from
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  // Read the JSON file and send its contents as the response
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error:', err.message);
      res.status(500).send('An error occurred.');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    }
  });
});

// Run getData() every 30 seconds
function getData() {
  try {
    const url = 'https://in.investing.com/currencies/usd-inr';
    axios.get(url)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        const INR = Number($('.last-price-value').text().trim());

        let obj = {
          "INR": INR
        };

        // Convert the object to a JSON string
        const jsonString = JSON.stringify(obj, null, 2);

        // Write the JSON string to a file
        fs.writeFileSync('data.json', jsonString);

        console.log('Data saved to data.json');
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getData(); // Initial data retrieval

// Set an interval to run getData every 30 seconds
setInterval(getData, 60000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Set up a static directory to serve files from
app.use(express.static(__dirname));
