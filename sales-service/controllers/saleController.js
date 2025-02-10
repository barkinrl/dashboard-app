const Sale = require("../model/Sale");

exports.createSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).send(sale);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.send(sales);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).send("Sale not found");
    }
    res.send(sale);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!sale) {
      return res.status(404).send("Sale not found");
    }
    res.send(sale);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).send("Sale not found");
    }
    res.send("Sale deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
