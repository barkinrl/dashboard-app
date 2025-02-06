import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("Authentication Tests", () => {
  // Test user data
  const adminUser = {
    name: "Admin Test",
    email: "admin0@test.com",
    password: "password123",
    role: "admin",
  };

  const employeeUser = {
    name: "Sales Test",
    email: "sales@test.com",
    password: "password123",
    role: "employee",
  };

  // Clean up before each test
  beforeEach(async () => {
    try {
      // Remove any existing test users
      await User.deleteMany({
        email: { $in: [adminUser.email, employeeUser.email] },
      });
    } catch (error) {
      console.error("Pre-test cleanup error:", error);
    }
  });

  // Clean up after each test
  afterEach(async () => {
    try {
      // Remove test users
      await User.deleteMany({
        email: { $in: [adminUser.email, employeeUser.email] },
      });
    } catch (error) {
      console.error("Post-test cleanup error:", error);
    }
  });

  describe("User Registration", () => {
    it("should register admin user successfully", async () => {
      const res = await request(app).post("/api/user/register").send(adminUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
    });

    it("should register sales user successfully", async () => {
      const res = await request(app)
        .post("/api/user/register")
        .send(employeeUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
    });

    it("should not allow duplicate email registration", async () => {
      // First registration
      await request(app).post("/api/user/register").send(adminUser);

      // Attempt duplicate registration
      const res = await request(app).post("/api/user/register").send(adminUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "User already exists.");
    });
  });

  describe("User Login", () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app).post("/api/user/register").send(adminUser);
    });

    it("should login successfully and return cookie", async () => {
      const res = await request(app).post("/api/user/login").send({
        email: adminUser.email,
        password: adminUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.body).toHaveProperty("message", "Logged in successfully");
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app).post("/api/user/login").send({
        email: adminUser.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid credentials.");
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/api/user/login").send({
        email: "nonexistent@test.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid credentials.");
    });
  });

  describe("Authentication Middleware", () => {
    let adminCookie;

    beforeEach(async () => {
      // Create and login admin user
      await request(app).post("/api/user/register").send(adminUser);

      const loginRes = await request(app).post("/api/user/login").send({
        email: adminUser.email,
        password: adminUser.password,
      });

      adminCookie = loginRes.headers["set-cookie"];
    });

    it("should reject access without cookie", async () => {
      const res = await request(app).get("/api/user");

      expect(res.status).toBe(401);
    });

    it("should reject access with invalid cookie", async () => {
      const res = await request(app)
        .get("/api/user")
        .set("Cookie", ["token=invalidtoken"]);

      expect(res.status).toBe(400);
    });
  });
});
