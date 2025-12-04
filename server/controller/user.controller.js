import User from "../model/user.model.js";
import dotenv from "dotenv";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import nodemailer from "nodemailer";
import Web3 from "web3";

dotenv.config();

const contractJson = require("../../client/src/contracts/Election.json");
const contractABI = contractJson.abi;

const contractAddress = process.env.CONTRACT_ADDRESS;

const web3 = new Web3("http://127.0.0.1:8545");
const contract = new web3.eth.Contract(contractABI, contractAddress);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const otpStore = new Map();

export const userRegister = async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ status: false, message: "No file uploaded" });
    }

    const saltRounds = 10;
    const { email, phone_No, citizenship_no, password } = body;

    const checkEmail = await User.findOne({ email });
    const checkPhoneNo = await User.findOne({ phone_No });
    const checkCitizenshipNo = await User.findOne({ citizenship_no });

    if (checkEmail || checkPhoneNo) {
      return res
        .status(200)
        .json({ status: false, message: "Email or Phone Number already used" });
    }

    if (checkCitizenshipNo) {
      return res
        .status(200)
        .json({ status: false, message: "Citizenship Number must be unique" });
    }
    y;
    const picture_url = await cloudinary.uploader.upload(file.path, {
      folder: "profile_pics",
    });

    body.pictureURL = picture_url.secure_url;
    body.user_type = "voter";

    // Hash password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res
          .status(400)
          .json({ status: false, message: "Error hashing password" });
      }
      body.password = hash;

      const userData = await User.create(body);

      if (userData) {
        const dataToHash = citizenship_no + email;
        const accounts = await web3.eth.getAccounts();
        await contract.methods
          .registerUser(dataToHash)
          .send({ from: accounts[0] });

        res.status(200).json({
          status: true,
          message: "Register Successful",
          data: userData,
        });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Failed to create user" });
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      status: false,
      message: error.message || "An error occurred during registration",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !["voter", "candidate", "admin"].includes(user.user_type)) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid Email or Password" });
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (result === true) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, otp);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your Login OTP",
          text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            return res.status(500).json({
              status: false,
              message: "Failed to send OTP",
              error: err,
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "OTP sent to email",
              data: user,
            });
          }
        });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Invalid Email or Password" });
      }
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error });
  }
};

export const verifyLogin = async (req, res) => {
  const { email, code } = req.body;

  const storedOtp = otpStore.get(email);

  if (storedOtp === code) {
    otpStore.delete(email); // clean up
    return res.status(200).json({
      status: true,
      message: "User Verified!",
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Invalid or expired OTP",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await User.findById(id);

    if (userData) {
      res
        .status(200)
        .json({ status: true, message: "User Found", data: userData });
    } else {
      res.status(404).json({ status: false, message: "No user found" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: error });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email });

    if (userData) {
      res
        .status(200)
        .json({ status: true, message: "User Found", data: userData });
    } else {
      res.status(404).json({ status: false, message: "No user found" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: error });
  }
};
