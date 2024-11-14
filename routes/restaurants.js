const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Restaurant = require("../models/Restaurant");

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
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

router.post(
  "/",
  [
    check("name").notEmpty().withMessage("Name is required").trim(),
    check("location").notEmpty().withMessage("Location is required").trim(),
    check("cuisine").notEmpty().withMessage("Cuisine is required").trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const newRestaurant = await Restaurant.create(req.body);
      res.status(201).json(newRestaurant);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
