import Sale from "../models/Sale.js";
import Customer from "../models/Customer.js";

// Create a new sale
export const createSale = async (req, res) => {
  try {
    const { customerId, status, notes } = req.body;

    // Check if the customer exists using the correct ID from the request
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Create a new sale associated with the customer
    const sale = new Sale({ customerId, status, notes });
    await sale.save();

    res.status(201).json(sale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get all sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("customerId", "name email");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// Update sale status
export const updateSaleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found." });
    }

    // Update status and add to history
    sale.status = status;
    sale.statusHistory.push({ status, date: new Date() });
    await sale.save();

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// Delete sale
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found." });
    }

    res.json({ message: "Sale deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
