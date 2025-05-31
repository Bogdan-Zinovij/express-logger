const axios = require("axios");

class FluentLogger {
  constructor() {
    this.url = "http://localhost:8080";
  }

  async log(level, message, meta = {}) {
    try {
      await axios.post(this.url, {
        level,
        message,
        ...meta,
        timestamp: new Date().toISOString(),
        app: "efk-express-lab",
      });
    } catch (error) {
      console.error("Fluentd log failed:", error.message);
    }
  }

  info(msg, meta) {
    console.log(msg);
    this.log("info", msg, meta);
  }

  debug(msg, meta) {
    console.debug(msg);
    this.log("debug", msg, meta);
  }

  error(msg, meta) {
    console.error(msg);
    this.log("error", msg, meta);
  }
}

module.exports = new FluentLogger();
