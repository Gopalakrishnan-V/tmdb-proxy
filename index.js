const express = require("express");
const app = express();
const axios = require("axios");
const base64 = require("base-64");
const utf8 = require("utf8");
const cache = require("memory-cache");
const { newMovies, feedsHome } = require("./data/data");

const CACHE_TTL = 120 * 1000;

app.get("/", (req, res) => {
  res.send({ message: "Welcome to TMDB Proxy app" });
});

app.get("/3/new", (req, res) => {
  res.send(newMovies);
});

app.get("/3/feeds/home", (req, res) => {
  res.send(feedsHome);
});

app.get("*", async (req, res) => {
  const orignalUrl = req.originalUrl;
  const bytes = utf8.encode(orignalUrl);
  const encodedUrl = base64.encode(bytes);

  const cacheData = cache.get(encodedUrl);
  if (cacheData) {
    console.log("Sending cache data: ", orignalUrl);
    return res.send(cacheData);
  }
  try {
    const response = await axios.get(`https://api.themoviedb.org${orignalUrl}`);
    cache.put(encodedUrl, response.data, CACHE_TTL);
    return res.send(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).send(error.response.data);
    } else {
      return res.status(500).send({
        status_code: 99,
        status_message: "Something went wrong"
      });
    }
  }
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});
