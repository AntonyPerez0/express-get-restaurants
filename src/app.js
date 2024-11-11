const express = require("express");
const app = express();
const Restaurant = require("../models/index");
const db = require("../db/connection");

//TODO: Create your GET Request Route Below:
app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
});

app.get("/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/restaurants", async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/restaurants/:id", async (req, res) => {
  try {
    const [updated] = await Restaurant.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedRestaurant = await Restaurant.findByPk(req.params.id);
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/restaurants/:id", async (req, res) => {
  try {
    const deleted = await Restaurant.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.json({ message: "Restaurant deleted" });
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = app;
