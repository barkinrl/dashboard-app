// api-gateway/swagger/definitions.js

module.exports = {
  User: {
    type: "object",
    properties: {
      username: {
        type: "string",
        required: true,
        description: "Username",
      },
      password: {
        type: "string",
        required: true,
        description: "Password",
      },
      role: {
        type: "string",
        required: true,
        enum: ["boss", "employee"],
        description: "User role (boss/employee))",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Creation date",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Last update date",
      },
    },
  },
  Customer: {
    type: "object",
    properties: {
      name: {
        type: "string",
        required: true,
        description: "Customer name",
      },
      email: {
        type: "string",
        required: true,
        format: "email",
        description: "Email address",
      },
      phone: {
        type: "string",
        description: "Phone number",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Creation date",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Last update date",
      },
    },
  },
  Sale: {
    type: "object",
    properties: {
      customerId: {
        type: "string",
        required: true,
        description: "Customer ID reference",
      },
      amount: {
        type: "number",
        required: true,
        description: "Sale amount",
      },
      status: {
        type: "string",
        enum: ["New", "Contact", "Deal", "Closed"],
        description: "Sale status ",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Creation date",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Last update date",
      },
    },
  },
};
