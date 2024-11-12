const express = require("express");
const app = express();
const db = require("../db/connection");
const restaurantsRouter = require("../routes/restaurants");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/restaurants", restaurantsRouter);

module.exports = app;
