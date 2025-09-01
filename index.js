require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();
const port = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTHORIZATION_ENDPOINT = process.env.AUTHORIZATION_ENDPOINT;
const TOKEN_ENDPOINT = process.env.TOKEN_ENDPOINT;
const RESOURCE_ENDPOINT = process.env.RESOURCE_ENDPOINT;

app.get('/auth', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    const authUrl = `${AUTHORIZATION_ENDPOINT}?` +
        `response_type=code&` +
        `client_id=${CLIENT_ID}&` +
        `redirect_uri=${REDIRECT_URI}&` +
        `scope=email profile openid&` +
        `state=${state}&`;
    res.send(`<a href="${authUrl}">Login with Google</a>`);
});

app.get('/callback', async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).send(`Error: ${error}`);
    }

    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
    const tokenResponse = await axios.post(TOKEN_ENDPOINT, new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in, token_type } = tokenResponse.data;

    const resourceResponse = await axios.get(RESOURCE_ENDPOINT, {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const userData = resourceResponse.data;

    res.send(`
      <h1>Success!</h1>
      <p>User Data: ${JSON.stringify(userData)}</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during token exchange or resource fetch');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});