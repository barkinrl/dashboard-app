const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../model/User"); // Model yolunu kontrol et
const userController = require("../controllers/userController"); // Controller yolunu kontrol et
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("userController", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri()); // Just the URI is enough now
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({}); // Clear the User collection after each test
  });

  describe("signup", () => {
    it("should create a new user and return a token", async () => {
      const req = {
        body: {
          username: "testuser",
          password: "password123",
          role: "employee",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await userController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });

      const user = await User.findOne({ username: "testuser" });
      expect(user).toBeDefined();
    });

    // Diğer signup test senaryoları buraya eklenecek...
  });

  describe("signin", () => {
    it("should sign in a user and return a token", async () => {
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username: "testuser",
        password: hashedPassword,
        role: "employee",
      });
      await user.save(); // Kullanıcıyı veritabanına kaydet

      const req = { body: { username: "testuser", password } };
      const res = { json: jest.fn() };

      await userController.signin(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
    });

    it("should handle invalid credentials", async () => {
      const req = {
        body: { username: "nonexistentuser", password: "wrongpassword" },
      };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await userController.signin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid credentials");
    });

    // Diğer signin test senaryoları buraya eklenecek...
  });
});
