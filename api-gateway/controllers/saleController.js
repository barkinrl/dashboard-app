const axios = require("axios");

exports.createSale = async (req, res) => {
  try {
    const response = await axios.post(
      "http://sales-service:3003/sales",
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

exports.getAllSales = async (req, res) => {
  try {
    const response = await axios.get("http://sales-service:3003/sales", {
      headers: { authorization: req.headers["authorization"] },
    });
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const response = await axios.get(
      `http://sales-service:3003/sales/${req.params.id}`,
      { headers: { authorization: req.headers["authorization"] } }
    );
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};

exports.updateSale = async (req, res) => {
  try {
    const response = await axios.put(
      `http://sales-service:3003/sales/${req.params.id}`,
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

exports.deleteSale = async (req, res) => {
  try {
    const response = await axios.delete(
      `http://sales-service:3003/sales/${req.params.id}`,
      { headers: { authorization: req.headers["authorization"] } }
    );
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};
