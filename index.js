const express = require("express");
const app = express();
const axios = require("axios");

app.get("/", (req, res) => {
  res.send({ message: "Welcome to TMDB Proxy app" });
});

app.get("/3/new", (req, res) => {
  res.send({ message: "Feed header is comming soon" });
});

app.get("/3/feeds/home", (req, res) => {
  res.send({ message: "You will get the Feed items soon" });
});

app.get("*", async (req, res) => {
  const orignalUrl = req.originalUrl;
  try {
    const response = await axios.get(`https://api.themoviedb.org${orignalUrl}`);
    res.send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({
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
