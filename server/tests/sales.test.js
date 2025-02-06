// tests/sales.test.js
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Sale from "../src/models/Sale.js";
import Customer from "../src/models/Customer.js";

describe("Sales API Tests", () => {
  let adminCookie;
  let customerId;

  const adminUser = {
    name: "Admin Test",
    email: "admin2@test.com",
    password: "password123",
    role: "admin",
  };

  const saleData = {
    status: "Contact",
    notes: [{ content: "Initial contact made." }],
  };

  // Updated customer data
  const customerData = {
    name: "Test Customer",
    email: "customer1@test.com",
    phone: "555-5555",
    company: "Test Co",
  };

  beforeAll(async () => {
    // Register and login admin user
    await request(app).post("/api/user/register").send(adminUser);
    const loginRes = await request(app).post("/api/user/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });
    adminCookie = loginRes.headers["set-cookie"];

    // Create a test customer
    const customerRes = await request(app)
      .post("/api/customers")
      .set("Cookie", adminCookie)
      .send(customerData);

    customerId = customerRes.body._id;
    expect(customerId).toBeDefined();
  });

  beforeEach(async () => {
    // Clean up existing test sales
    await Sale.deleteMany({ customerId });
  });

  afterEach(async () => {
    // Clean up test sales
    await Sale.deleteMany({ customerId });
  });

  afterAll(async () => {
    // Clean up the admin user and test customers
    await User.deleteMany({ email: adminUser.email });
    await Customer.deleteMany({ email: customerData.email });
  });

  it("should create a new sale", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Cookie", adminCookie)
      .send({ ...saleData, customerId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("status", saleData.status);
    expect(res.body.notes[0]).toHaveProperty(
      "content",
      saleData.notes[0].content
    );
  });

  it("should retrieve all sales", async () => {
    // First, create a sale
    await request(app)
      .post("/api/sales")
      .set("Cookie", adminCookie)
      .send({ ...saleData, customerId });

    // Retrieve all sales
    const res = await request(app).get("/api/sales").set("Cookie", adminCookie);

    // Assertions
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update an existing sale with a verified status", async () => {
    // First, create a sale
    const saleRes = await request(app)
      .post("/api/sales")
      .set("Cookie", adminCookie)
      .send({ ...saleData, customerId });

    const saleId = saleRes.body._id;
    expect(saleId).toBeDefined();

    // Use a verified status
    const updatedSaleData = { status: "Deal" };

    // Update the sale
    const updateRes = await request(app)
      .put(`/api/sales/${saleId}`)
      .set("Cookie", adminCookie)
      .send(updatedSaleData);

    // Assertions
    expect(updateRes.status).toBe(200);

    // Verify updated fields
    expect(updateRes.body).toHaveProperty("status", "Deal");

    // Verify original fields still exist and are unchanged (except updated ones)
    expect(updateRes.body).toHaveProperty("notes");
    expect(Array.isArray(updateRes.body.notes)).toBe(true);
    expect(updateRes.body.notes[0]).toHaveProperty(
      "content",
      saleData.notes[0].content
    );

    expect(updateRes.body).toHaveProperty("customerId");
    expect(updateRes.body.customerId).toBe(customerId);

    // Optionally verify updatedAt field is after createdAt
    const createdAt = new Date(updateRes.body.createdAt);
    const updatedAt = new Date(updateRes.body.updatedAt);
  });

  it("should delete a sale", async () => {
    // First create a sale
    const saleRes = await request(app)
      .post("/api/sales")
      .set("Cookie", adminCookie)
      .send({ ...saleData, customerId });

    const saleId = saleRes.body._id;
    expect(saleId).toBeDefined();

    const deleteRes = await request(app)
      .delete(`/api/sales/${saleId}`)
      .set("Cookie", adminCookie);

    expect(deleteRes.status).toBe(200);

    // Ensure the sale no longer exists
    const fetchRes = await request(app)
      .get(`/api/sales/${saleId}`)
      .set("Cookie", adminCookie);

    expect(fetchRes.status).toBe(404); // Assuming 404 for not found
  });
});
