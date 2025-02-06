import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dashboard API",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
  },
  apis: ["./src/routes/*.js"], // Adjust the path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
