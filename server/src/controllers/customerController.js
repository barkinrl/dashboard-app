import Customer from "../models/Customer.js";

// Create a new customer
export const createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found." });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found." });
    res.json({ message: "Customer deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
