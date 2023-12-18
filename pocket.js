const got = require("got");

const PocketAPI = class {
  constructor(
    consumer_key,
    redirect_uri = "pocketapp1234:authorizationFinished"
  ) {
    this.consumer_key = consumer_key;
    this.redirect_uri = redirect_uri;
    this.config = {
      pocketUrl: {
        request: "https://getpocket.com/v3/oauth/request",
        authorize: "https://getpocket.com/v3/oauth/authorize",
        get: "https://getpocket.com/v3/get",
        add: "https://getpocket.com/v3/add",
        modify: "https://getpocket.com/v3/send",
      },
      headers: {
        "content-type": "application/json",
        "X-Accept": "application/json",
      },
    };
  }

  setRequestToken(requestToken) {
    this.request_token = requestToken;
  }

  setAccessToken(accessToken) {
    this.access_token = accessToken;
  }

  setUserName(userName) {
    this.user_name = userName;
  }

  setOptions(values, endpoint, method = "post") {
    return {
      headers: this.config.headers,
      body: JSON.stringify(values),
      url: endpoint,
      method: method,
    };
  }

  async getRequestToken(callback) {
    if (this.request_token) {
      return await this.request_token;
    }

    let response;
    let token;
    const values = {
      consumer_key: this.consumer_key,
      redirect_uri: this.redirect_uri,
    };

    const options = this.setOptions(values, this.config.pocketUrl.request);

    try {
      response = await got(options);
    } catch (e) {
      console.error(e.name + ": " + e.message);
      throw new Error(e);
    }

    token = JSON.parse(response.body);
    this.request_token = token.code;

    if (callback) {
      return callback(token.code);
    }
    return token.code;
  }

  async getAccessToken(callback) {
    if (this.access_token) {
      console.log("comes from cache");
      return await {
        access_token: this.access_token,
        username: this.user_name,
      };
    }

    let token;
    let response;
    const values = {
      consumer_key: this.consumer_key,
      code: this.request_token,
    };

    const options = this.setOptions(values, this.config.pocketUrl.authorize);

    try {
      response = await got(options);
    } catch (e) {
      console.error(e.name + ": " + e.message);
      console.log(e);
      throw new Error(e);
    }

    token = JSON.parse(response.body);
    // this.setAccessToken(token.access_token);
    this.access_token = token.access_token;
    this.user_name = token.username;

    if (callback) {
      return callback(token);
    }
    console.log("not from cache");
    return token;
  }

  async getArticles(params, callback) {
    let response;
    const access = {
      consumer_key: this.consumer_key,
      access_token: this.access_token,
    };

    const values = { ...access, ...params };
    console.log("header values ***************");
    console.log(values);

    const options = this.setOptions(values, this.config.pocketUrl.get);

    try {
      response = await got(options);
    } catch (e) {
      console.error(e.name + ": " + e.message);
      throw new Error(e);
      //   return e;
    }

    if (callback) {
      return callback(JSON.parse(response.body));
    }

    return JSON.parse(response.body);
  }

  async addArticles(params, callback) {
    let response;
    const access = {
      consumer_key: this.consumer_key,
      access_token: this.access_token,
    };

    const values = { ...access, ...params };

    const options = this.setOptions(values, this.config.pocketUrl.add);
    try {
      response = await got(options);
    } catch (e) {
      console.error(e.name + ": " + e.message);
      throw new Error(e);
    }

    if (callback) {
      return callback(JSON.parse(response.body));
    }

    return JSON.parse(response.body);
  }

  async modifyArticles(actions, callback) {
    let response;
    const values = {
      actions: actions,
      consumer_key: this.consumer_key,
      access_token: this.access_token,
    };

    const options = this.setOptions(values, this.config.pocketUrl.modify);

    try {
      response = await got(options);
    } catch (e) {
      console.log("checking");
      console.error(e.name + ": " + e.message);
      throw new Error(e);
    }

    if (callback) {
      return callback(JSON.parse(response.body));
    }

    return JSON.parse(response.body);
  }
};

module.exports = PocketAPI;
