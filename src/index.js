const express = require("express");
const logger = require("./logger/fluentLogger");

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  logger.info("GET / — main page has been opened");
  res.send("Welcome to the main page!");
});

app.get("/debug", (req, res) => {
  logger.debug("GET /debug — debug completed");
  res.send("Debug message send");
});

app.get("/error", (req, res) => {
  logger.error("GET /error — something goes wrong");
  res.status(500).send("Error occurred");
});

app.listen(PORT, () => {
  logger.info(`Server listening on  http://localhost:${PORT}`);
});
