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
        expect.objectContaining({
          name: "AppleBees",
          location: "Texas",
          cuisine: "FastFood",
        }),
        expect.objectContaining({
          name: "LittleSheep",
          location: "Dallas",
          cuisine: "Hotpot",
        }),
        expect.objectContaining({
          name: "Spice Grill",
          location: "Houston",
          cuisine: "Indian",
        }),
      ])
    );
  });

  test("GET /restaurants/:id should return the correct data", async () => {
    const response = await request(app).get("/restaurants/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "AppleBees",
        location: "Texas",
        cuisine: "FastFood",
      })
    );
  });

  test("POST /restaurants should add a new restaurant", async () => {
    const newRestaurant = {
      name: "Test Restaurant",
      location: "Test City",
      cuisine: "Test Cuisine",
    };
    const postResponse = await request(app)
      .post("/restaurants")
      .send(newRestaurant);
    expect(postResponse.statusCode).toBe(201);
    expect(postResponse.body).toEqual(expect.objectContaining(newRestaurant));
  });

  test("PUT /restaurants/:id should update the restaurant with provided value", async () => {
    const updatedData = {
      name: "Updated Restaurant",
      location: "Updated City",
      cuisine: "Updated Cuisine",
    };
    const putResponse = await request(app)
      .put("/restaurants/1")
      .send(updatedData);
    expect(putResponse.statusCode).toBe(200);
    expect(putResponse.body).toEqual(expect.objectContaining(updatedData));
  });

  test("DELETE /restaurants/:id should delete the restaurant with the provided id", async () => {
    const deleteResponse = await request(app).delete("/restaurants/1");
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body).toEqual({ message: "Restaurant deleted" });
  });
});
