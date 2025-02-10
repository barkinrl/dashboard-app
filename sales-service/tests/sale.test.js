const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Sale = require("../model/Sale");
const User = require("../../user-service/model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("Sale Controller", () => {
  let mongoServer;
  let token;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: "testuser",
      password: hashedPassword,
      role: "boss",
    });
    await user.save();

    token = jwt.sign({ userId: user._id, role: user.role }, "secret_key");
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Sale.deleteMany({});
  });

  describe("createSale", () => {
    it("should allow boss to create a new sale", async () => {
      const newSale = {
        customer: "646b5c3b96434455845e9c9a",
        product: "646b5c3b96434455845e9c9b",
        quantity: 10,
      };

      const res = await request(app)
        .post("/sales")
        .set("Authorization", `${token}`)
        .send(newSale)
        .expect(201);

      expect(res.body._id).toBeDefined();
      expect(res.body.customer).toBe(newSale.customer);
      expect(res.body.product).toBe(newSale.product);
      expect(res.body.quantity).toBe(newSale.quantity);

      const sale = await Sale.findById(res.body._id);
      expect(sale).toBeDefined();
    });

    it("should deny access to employee", async () => {
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);
      const employeeUser = new User({
        username: "employeeuser",
        password: hashedPassword,
        role: "employee",
      });
      await employeeUser.save();
      const employeeToken = jwt.sign(
        { userId: employeeUser._id, role: employeeUser.role },
        "secret_key"
      );

      const newSale = {
        customer: "646b5c3b96434455845e9c9a",
        product: "646b5c3b96434455845e9c9b",
        quantity: 10,
      };
      const res = await request(app)
        .post("/sales")
        .set("Authorization", `${employeeToken}`) // Token'ı kullan
        .send(newSale)
        .expect(403);
    });

    it("should handle missing required fields", async () => {
      const res = await request(app)
        .post("/sales")
        .set("Authorization", `${token}`)
        .send({})
        .expect(400);

      expect(res.text).toContain("is required");
    });
  });

  describe("getAllSales", () => {
    it("should return all sales", async () => {
      await Sale.create({
        customer: "646b5c3b96434455845e9c9a",
        product: "646b5c3b96434455845e9c9b",
        quantity: 10,
      });
      await Sale.create({
        customer: "646b5c3b96434455845e9c9c",
        product: "646b5c3b96434455845e9c9d",
        quantity: 5,
      });

      const res = await request(app)
        .get("/sales")
        .set("Authorization", `${token}`)
        .expect(200);

      expect(res.body.length).toBe(2);
      expect(res.body[0].customer).toBeDefined();
    });
  });
});
