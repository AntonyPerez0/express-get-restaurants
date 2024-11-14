const request = require("supertest");
const app = require("./src/app");
const db = require("./db/connection");
const { seedRestaurant } = require("./seedData");
const Restaurant = require("./models/Restaurant");

beforeAll(async () => {
  await db.sync({ force: true });
  await Restaurant.bulkCreate(seedRestaurant);
});

describe("Restaurants API", () => {
  test("GET /restaurants should return status code 200", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toBe(200);
  });

  test("GET /restaurants should return an array of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /restaurants should return the correct number of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body.length).toBe(3);
  });

  test("GET /restaurants should return the correct restaurant data", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "AppleBees" }),
        expect.objectContaining({ name: "LittleSheep" }),
        expect.objectContaining({ name: "Spice Grill" }),
      ])
    );
  });

  describe("POST /restaurants", () => {
    test("should create a new restaurant when all fields are valid", async () => {
      const newRestaurant = {
        name: "New Restaurant",
        location: "New Location",
        cuisine: "New Cuisine",
      };
      const response = await request(app)
        .post("/restaurants")
        .send(newRestaurant);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(newRestaurant.name);
    });

    test("should return errors when name is empty", async () => {
      const newRestaurant = {
        name: "",
        location: "Test Location",
        cuisine: "Test Cuisine",
      };
      const response = await request(app)
        .post("/restaurants")
        .send(newRestaurant);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(Array.isArray(response.body.error)).toBe(true);
      expect(response.body.error).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Name is required" }),
        ])
      );
    });

    test("should return errors when location is empty", async () => {
      const newRestaurant = {
        name: "Test Restaurant",
        location: "",
        cuisine: "Test Cuisine",
      };
      const response = await request(app)
        .post("/restaurants")
        .send(newRestaurant);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(Array.isArray(response.body.error)).toBe(true);
      expect(response.body.error).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Location is required" }),
        ])
      );
    });

    test("should return errors when cuisine is empty", async () => {
      const newRestaurant = {
        name: "Test Restaurant",
        location: "Test Location",
        cuisine: "",
      };
      const response = await request(app)
        .post("/restaurants")
        .send(newRestaurant);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(Array.isArray(response.body.error)).toBe(true);
      expect(response.body.error).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Cuisine is required" }),
        ])
      );
    });

    test("should return errors when all fields are empty", async () => {
      const newRestaurant = {
        name: "",
        location: "",
        cuisine: "",
      };
      const response = await request(app)
        .post("/restaurants")
        .send(newRestaurant);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(Array.isArray(response.body.error)).toBe(true);
      expect(response.body.error.length).toBe(3);
      expect(response.body.error).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: "Name is required" }),
          expect.objectContaining({ msg: "Location is required" }),
          expect.objectContaining({ msg: "Cuisine is required" }),
        ])
      );
    });
  });
});
