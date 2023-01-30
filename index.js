const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const {
  createNewBill,
  getBillingList,
  updateBill,
  deleteBill,
  searchBill,
} = require("./controllers/BillingController");
const { logIn, register } = require("./controllers/authController");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to mongodb");
  } catch (error) {
    throw error;
  }
};

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/registration", register);
app.post("/api/login", logIn);
app.get("/api/billing-list", getBillingList);
app.post("/api/add-billing", createNewBill);
app.post("/api/update-billing/:id", updateBill);
app.delete("/api/delete-billing/:id", deleteBill);
app.get("/api/search", searchBill);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "something is wrong!";
  res.status(status).json({
    success: false,
    message: message,
    status: status,
    stack: err.stack,
  });
});

app.listen(8000, () => {
  connect();
});
