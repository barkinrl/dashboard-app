const express = require("express");
const app = express();
const expressSwagger = require("express-swagger-generator")(app);

const userController = require("./controllers/userController");
const customerController = require("./controllers/customerController");
const salesController = require("./controllers/saleController");

const authenticate = require("./middlewares/authenticate");
const authorize = require("./middlewares/authorizeRole");

app.use(express.json());

// Swagger config
const swaggerOptions = {
  swaggerDefinition: {
    swagger: "2.0",
    info: {
      title: "Microservice API Gateway",
      version: "1.0.0",
      description: "API Documentation",
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ["http"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "JWT token for 'Bearer {token}' format",
      },
    },
    definitions: require("./swagger/definitions"),
  },
  basedir: __dirname,
  files: ["./index.js"],
  route: {
    url: "/api-docs",
    docs: "/api-docs.json",
  },
};

expressSwagger(swaggerOptions);

// User Routes
/**
 * @route POST /signup
 * @group Authentication - Operations about user authentication
 * @param {User.model} body.body.required - username, password and role
 * @returns {User.model} 201 - User created successfully
 * @returns {Error}  400 - Invalid input
 */
app.post("/signup", userController.signup);

/**
 * @route POST /signin
 * @group Authentication - Operations about user authentication
 * @param {User.model} body.body.required - username and password
 * @returns {User.model} 200 - Login successful
 * @returns {Error}  401 - Invalid credentials
 */
app.post("/signin", userController.signin);

// Customer Routes
/**
 * @route POST /customers
 * @group Customers - Customer management operations
 * @param {Customer.model} customer.body.required - Customer details
 * @returns {Customer.model} 201 - Created customer
 * @returns {Error} 400 - Validation error
 * @security JWT
 */
app.post(
  "/customers",
  authenticate,
  authorize(["boss"]),
  customerController.createCustomer
);

/**
 * @route GET /customers
 * @group Customers - Customer management operations
 * @returns {Array.<Customer>} 200 - List of customers
 * @returns {Error} 401 - Unauthorized
 * @security JWT
 */
app.get(
  "/customers",
  authenticate,
  authorize(["boss"]),
  customerController.getAllCustomers
);

/**
 * @route GET /customers/{id}
 * @group Customers - Customer management operations
 * @param {string} id.path.required - Customer ID
 * @returns {Customer.model} 200 - Customer details
 * @returns {Error} 404 - Customer not found
 * @security JWT
 */
app.get(
  "/customers/:id",
  authenticate,
  authorize(["boss"]),
  customerController.getCustomerById
);

/**
 * @route PUT /customers/{id}
 * @group Customers - Customer management operations
 * @param {string} id.path.required - Customer ID
 * @param {Customer.model} customer.body.required - Updated customer details
 * @returns {Customer.model} 200 - Updated customer
 * @returns {Error} 404 - Customer not found
 * @security JWT
 */
app.put(
  "/customers/:id",
  authenticate,
  authorize(["boss"]),
  customerController.updateCustomer
);

/**
 * @route DELETE /customers/{id}
 * @group Customers - Customer management operations
 * @param {string} id.path.required - Customer ID
 * @returns {string} 200 - Success message
 * @returns {Error} 404 - Customer not found
 * @security JWT
 */
app.delete(
  "/customers/:id",
  authenticate,
  authorize(["boss"]),
  customerController.deleteCustomer
);

// Sales Routes
/**
 * @route POST /sales
 * @group Sales - Sales management operations
 * @param {Sale.model} sale.body.required - Sale details
 * @returns {Sale.model} 201 - Created sale
 * @returns {Error} 400 - Validation error
 * @security JWT
 */
app.post("/sales", authenticate, salesController.createSale);

/**
 * @route GET /sales
 * @group Sales - Sales management operations
 * @returns {Array.<Sale>} 200 - List of sales
 * @returns {Error} 401 - Unauthorized
 * @security JWT
 */
app.get("/sales", authenticate, salesController.getAllSales);

/**
 * @route GET /sales/{id}
 * @group Sales - Sales management operations
 * @param {string} id.path.required - Sale ID
 * @returns {Sale.model} 200 - Sale details
 * @returns {Error} 404 - Sale not found
 * @security JWT
 */
app.get("/sales/:id", authenticate, salesController.getSaleById);

/**
 * @route PUT /sales/{id}
 * @group Sales - Sales management operations
 * @param {string} id.path.required - Sale ID
 * @param {Sale.model} sale.body.required - Updated sale details
 * @returns {Sale.model} 200 - Updated sale
 * @returns {Error} 404 - Sale not found
 * @security JWT
 */
app.put("/sales/:id", authenticate, salesController.updateSale);

/**
 * @route DELETE /sales/{id}
 * @group Sales - Sales management operations
 * @param {string} id.path.required - Sale ID
 * @returns {string} 200 - Success message
 * @returns {Error} 404 - Sale not found
 * @security JWT
 */
app.delete("/sales/:id", authenticate, salesController.deleteSale);

// Server start
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log(`API Gateway running on port 3000`);
    console.log(
      `Swagger Documentation available at http://localhost:3000/api-docs`
    );
  });
}

module.exports = app;
