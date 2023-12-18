const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const getPocket = require("./pocket.js");
const next = require("call-me-maybe/src/next.js");

// const poke = require("./pocket.js")
// new poke()

let corsOption = {
  origin: "*",
  methods: ["POST", "GET"],
  credentials: true,
};
const app = express();
app.use(cors(corsOption));

const port = 3000;

let consumer_key = "109804-3546aeb3816b179ed20c9f8";
let redirect_uri = "http://localhost:4200/authorisation";

let pocket = new getPocket(consumer_key, redirect_uri);
let requestToken;
let accessToken;

let lastSince;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  return res.json({ Name: "John Dane", age: 28 });
});

app.post("/authoriseuser", async (req, res) => {
  requestToken = await pocket.getRequestToken();
  console.log(`The request token is ${requestToken}`);
  return res.json({
    redirectUrl: `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirect_uri}`,
  });
});

app.post("/authorise", async (req, res) => {
  console.log("entered connection");
  accessToken = await pocket.getAccessToken();
  let result = res.json(accessToken);
  console.log(result);
  return result;
});

const getArticles = async (params) => {
  try {
    articles = await pocket.getArticles(params);
  } catch (e) {
    console.error(e);
    console.log("Catched");
    // next(e);
  }
  return articles;
};

app.post("/articles", async (req, res) => {
  try {
    console.log("++++++++++++++++++++++++");
    console.log(req.body);
    articles = await pocket.getArticles(req.body);
    return res.json(articles);
  } catch (e) {
    console.error(e);
    console.log("Catched");
    let errorCode = e.message.substring(25, 28);
    console.log("error code " + errorCode);
    let errorMsg = e.message.substring(29);
    return res.status(errorCode).json({ error_message: errorMsg });
  }
});

app.post("/articles/add", async (req, res) => {
  try {
    response = await pocket.addArticles(req.body);
  } catch (e) {
    let errorCode = e.message.substring(15, 18);
    let errorMsg = e.message.substring(19);
    return res.status(errorCode).json({ error_message: errorMsg });
  }
});

app.post("/articles/archived", async (req, res) => {
  try {
    articles = await pocket.getArticles(req.body);
  } catch (e) {
    let errorCode = e.message.substring(15, 18);
    let errorMsg = e.message.substring(19);
    return res.status(errorCode).json({ error_message: errorMsg });
  }
  return res.json(articles);
});

app.post("/articles/favourites", async (req, res) => {
  try {
    articles = await pocket.getArticles(req.body);
  } catch (e) {
    let errorCode = e.message.substring(15, 18);
    let errorMsg = e.message.substring(19);
    return res.status(errorCode).json({ error_message: errorMsg });
  }
  return res.json(articles);
});

app.post("/articles/action_favourite", async (req, res) => {
  try {
    response = await pocket.modifyArticles(req.body);
  } catch (e) {
    let errorCode = e.message.substring(15, 18);
    let errorMsg = e.message.substring(19);
    return res.status(errorCode).json({ error_message: errorMsg });
  }
  return res.json(express.response);
});

app.post("/articles/action_archive", async (req, res) => {
  try {
    response = await pocket.modifyArticles(req.body);
  } catch (e) {
    let errorCode = e.message.substring(15, 18);
    let errorMsg = e.message.substring(19);
    return res.status(errorCode).json({ error_message: errorMsg });
  }

  return res.json(express.response);
});

app.post("/articles/action_delete", async (req, res) => {
  try {
    response = await pocket.modifyArticles(req.body);
  } catch (e) {
    let errorCode = e.message.substring(15, 18);
    let errorMsg = e.message.substring(19);
    return res.status(errorCode).json({ error_message: errorMsg });
  }

  return res.json(express.response);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
