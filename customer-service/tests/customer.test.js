const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Customer = require("../model/Customer");
const User = require("../../user-service/model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("Customer Controller", () => {
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
    await Customer.deleteMany({});
  });

  describe("createCustomer", () => {
    it("should allow boss to create a new customer", async () => {
      const newCustomer = {
        name: "Test Customer",
        email: "test@example.com",
        phone: "123-456-7890",
      };

      const res = await request(app)
        .post("/customers")
        .set("Authorization", `${token}`)
        .send(newCustomer)
        .expect(201);

      expect(res.body._id).toBeDefined();
      expect(res.body.name).toBe(newCustomer.name);
      expect(res.body.email).toBe(newCustomer.email);
      expect(res.body.phone).toBe(newCustomer.phone);

      const customer = await Customer.findById(res.body._id);
      expect(customer).toBeDefined();
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

      const newCustomer = {
        name: "Test Customer",
        email: "test@example.com",
        phone: "123-456-7890",
      };
      const res = await request(app)
        .post("/customers")
        .set("Authorization", `${employeeToken}`)
        .send(newCustomer)
        .expect(403);
    });

    it("should handle missing required fields", async () => {
      const res = await request(app)
        .post("/customers")
        .set("Authorization", `${token}`)
        .send({})
        .expect(400);

      expect(res.text).toContain("is required");
    });
  });

  describe("getAllCustomers", () => {
    it("should return all customers", async () => {
      await Customer.create({
        name: "Customer 1",
        email: "c1@example.com",
        phone: "111-111-1111",
      });
      await Customer.create({
        name: "Customer 2",
        email: "c2@example.com",
        phone: "222-222-2222",
      });

      const res = await request(app)
        .get("/customers")
        .set("Authorization", `${token}`)
        .expect(200);

      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBeDefined();
    });
  });

  describe("getCustomerById", () => {
    it("should return a customer by ID", async () => {
      const customer = await Customer.create({
        name: "Test Customer",
        email: "test@example.com",
        phone: "123-456-7890",
      });

      const res = await request(app)
        .get(`/customers/${customer._id}`)
        .set("Authorization", `${token}`)
        .expect(200);

      expect(res.body.name).toBe(customer.name);
    });

    it("should return 404 if customer not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/customers/${nonExistentId}`)
        .set("Authorization", `${token}`)
        .expect(404);

      expect(res.text).toBe("Customer not found");
    });
  });

  describe("updateCustomer", () => {
    it("should update a customer", async () => {
      const customer = await Customer.create({
        name: "Test Customer",
        email: "test@example.com",
        phone: "123-456-7890",
      });
      const updatedCustomer = {
        name: "Updated Customer",
        email: "updated@example.com",
        phone: "987-654-3210",
      };

      const res = await request(app)
        .put(`/customers/${customer._id}`)
        .set("Authorization", `${token}`)
        .send(updatedCustomer)
        .expect(200);

      expect(res.body.name).toBe(updatedCustomer.name);
      expect(res.body.email).toBe(updatedCustomer.email);
      expect(res.body.phone).toBe(updatedCustomer.phone);

      const dbCustomer = await Customer.findById(customer._id);
      expect(dbCustomer.name).toBe(updatedCustomer.name);
    });

    it("should return 404 if customer not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/customers/${nonExistentId}`)
        .set("Authorization", `${token}`)
        .send({ name: "Updated Customer" })
        .expect(404);

      expect(res.text).toBe("Customer not found");
    });
  });

  describe("deleteCustomer", () => {
    it("should delete a customer", async () => {
      const customer = await Customer.create({
        name: "Test Customer",
        email: "test@example.com",
        phone: "123-456-7890",
      });

      const res = await request(app)
        .delete(`/customers/${customer._id}`)
        .set("Authorization", `${token}`)
        .expect(200);

      expect(res.text).toBe("Customer deleted successfully");

      const dbCustomer = await Customer.findById(customer._id);
      expect(dbCustomer).toBeNull();
    });

    it("should return 404 if customer not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/customers/${nonExistentId}`)
        .set("Authorization", `${token}`)
        .expect(404);

      expect(res.text).toBe("Customer not found");
    });
  });
});
