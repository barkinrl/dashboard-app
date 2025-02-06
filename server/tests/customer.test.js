import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Customer from "../src/models/Customer.js";

describe("Customers API Tests", () => {
  let adminCookie;

  const adminUser = {
    name: "Admin Test",
    email: "admin1@test.com",
    password: "password123",
    role: "admin",
  };

  const customerData = {
    name: "Test Customer",
    email: "customer0@test.com",
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
  });

  beforeEach(async () => {
    // Clean up existing test customers
    await Customer.deleteMany({ email: customerData.email });
  });

  afterEach(async () => {
    // Clean up test customers
    await Customer.deleteMany({ email: customerData.email });
  });

  afterAll(async () => {
    // Clean up the admin user
    await User.deleteMany({ email: adminUser.email });
  });

  it("should create a new customer", async () => {
    const res = await request(app)
      .post("/api/customers")
      .set("Cookie", adminCookie)
      .send(customerData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("email", customerData.email);
  });

  it("should get a list of customers", async () => {
    const res = await request(app)
      .get("/api/customers")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update an existing customer", async () => {
    // First, create a customer
    const createRes = await request(app)
      .post("/api/customers")
      .set("Cookie", adminCookie)
      .send(customerData);

    // Extract the customer ID from the response
    const customerId = createRes.body._id;
    expect(customerId).toBeDefined();

    // Define updated customer data
    const updatedCustomerData = { ...customerData, phone: "555-1234" };

    // Send update request using the customer ID
    const updateRes = await request(app)
      .put(`/api/customers/${customerId}`)
      .set("Cookie", adminCookie)
      .send(updatedCustomerData);

    // Verify the response contains the updated customer data
    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty("phone", "555-1234");
    expect(updateRes.body).toHaveProperty("name", customerData.name);
    expect(updateRes.body).toHaveProperty("email", customerData.email);
    expect(updateRes.body).toHaveProperty("company", customerData.company);
  });

  it("should delete an existing customer", async () => {
    // First, create a customer
    const createRes = await request(app)
      .post("/api/customers")
      .set("Cookie", adminCookie)
      .send(customerData);

    // Extract the customer ID from the response
    const customerId = createRes.body._id;
    expect(customerId).toBeDefined();

    // Send delete request using the customer ID
    const deleteRes = await request(app)
      .delete(`/api/customers/${customerId}`)
      .set("Cookie", adminCookie);

    // Verify the customer was successfully deleted
    expect(deleteRes.status).toBe(200);

    // Optionally, you can attempt to fetch the deleted customer to ensure it's no longer available
    const fetchRes = await request(app)
      .get(`/api/customers/${customerId}`)
      .set("Cookie", adminCookie);

    expect(fetchRes.status).toBe(404); // Assuming 404 is returned for non-existent resources
  });
});
