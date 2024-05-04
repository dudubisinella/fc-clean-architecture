import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const input = {
      name: "Shirt",
      price: 100,
    };
    const response = await request(app).post("/product").send(input);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual("Shirt");
    expect(response.body.price).toEqual(100);
  });

  it("should not create a product when name is not provided", async () => {
    const input = {
      name: "",
      price: 100,
    };
    const response = await request(app).post("/product").send(input);

    expect(response.status).toEqual(400);
  });

  it("should list all products", async () => {
    const input1 = {
      name: "Shirt",
      price: 100,
    };
    const input2 = {
      name: "Shirt2",
      price: 100,
    };
    await request(app).post("/product").send(input1);
    await request(app).post("/product").send(input2);

    const response = await request(app).get("/product").send();
    const product1 = response.body.products[0];
    const product2 = response.body.products[1];

    expect(response.status).toEqual(200);
    expect(response.body.products.length).toEqual(2);

    expect(product1.name).toEqual("Shirt");
    expect(product2.name).toEqual("Shirt2");
  });
});
