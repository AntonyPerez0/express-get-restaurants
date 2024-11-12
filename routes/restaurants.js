const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

router.post("/", async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

module.exports = router;
