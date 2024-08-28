const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// 代理请求到 News API
app.use(cors());

app.get('/news', async (req, res) => {
    const { q, page } = req.query;
    const userAPIKey = '274be492f3694b8eb864309d284d9c98'; // 替换为你的API密钥

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

// 监听端口
app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});