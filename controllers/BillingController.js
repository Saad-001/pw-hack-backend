const Bill = require("../models/Bill");

const createNewBill = async (req, res, next) => {
  const newBill = new Bill(req.body);
  try {
    const saveBill = await newBill.save();
    res.status(200).json(saveBill);
  } catch (err) {
    next(err);
  }
};

const getBillingList = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  try {
    const bills = await Bill.find();
    let billsData;
    if (endIndex < bills.length) {
      billsData = bills.slice(startIndex, endIndex);
    } else if (startIndex < bills.length) {
      billsData = bills.slice(startIndex, bills.length);
    } else {
      billsData = bills;
    }
    res.status(200).json({ len: bills.length, data: billsData });
  } catch (err) {
    next(err);
  }
};

const updateBill = async (req, res, next) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedBill);
  } catch (err) {
    next(err);
  }
};

const deleteBill = async (req, res, next) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.status(200).json("Bill has been deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { createNewBill, getBillingList, updateBill, deleteBill };
