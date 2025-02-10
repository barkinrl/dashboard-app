const axios = require("axios");

exports.signup = async (req, res) => {
  try {
    const response = await axios.post(
      "http://user-service:3001/signup",
      req.body
    );
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};

exports.signin = async (req, res) => {
  try {
    const response = await axios.post(
      "http://user-service:3001/signin",
      req.body
    );
    res.send(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || "Service error");
  }
};
