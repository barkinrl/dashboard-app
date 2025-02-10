const axios = require("axios");

exports.createCustomer = async (req, res) => {
  try {
    const response = await axios.post(
      "http://customer-service:3002/customers",
      req.body,
      {
        headers: { authorization: req.headers["authorization"] },
      }
    );
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const response = await axios.get("http://customer-service:3002/customers", {
      headers: { authorization: req.headers["authorization"] },
    });
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const response = await axios.get(
      `http://customer-service:3002/customers/${req.params.id}`,
      { headers: { authorization: req.headers["authorization"] } }
    );
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const response = await axios.put(
      `http://customer-service:3002/customers/${req.params.id}`,
      req.body,
      { headers: { authorization: req.headers["authorization"] } }
    );
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const response = await axios.delete(
      `http://customer-service:3002/customers/${req.params.id}`,
      { headers: { authorization: req.headers["authorization"] } }
    );
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};
