const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());

//請求獲取新聞資訊
app.get('/news', async (req, res) => {
    const { q, page } = req.query;
    const userAPIKey = 'fb775cb64d134b5a87af351021cce00d'; 

    try {
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q,
                from: new Date(Date.now() - 86400 * 1000 * 3).toISOString().split('T')[0],
                language: 'en',
                pageSize: 20,
                page,
                sortBy: 'popularity',
                apiKey: userAPIKey,
            },
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//請求獲取township weather data
app.get("/townships", async(req, res) => {
    const {cityID} = req.query;
    const authorizationKey = "CWA-25D5C0B9-0C4D-47FA-8063-886648122427";

    try {
        const cityURL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${cityID}?Authorization=${authorizationKey}`;
        const response = await axios.get(cityURL);
        res.json(response.data);
    } 
    catch (error) {
        res.status(500).send(error.message);
    }
})

//請求獲取city weather data
app.get("/city-weather", async(req, res) => {
    const authorizationKey = "CWA-25D5C0B9-0C4D-47FA-8063-886648122427";

    try {
        const cityURL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${authorizationKey}`;
        const response = await axios.get(cityURL);
        res.json(response.data);
    } 
    catch (error) {
        res.status(500).send(error.message);
    }
})




app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
