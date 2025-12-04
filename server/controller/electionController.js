// controllers/electionController.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Web3 from "web3";
import dotenv from "dotenv";
dotenv.config();

// Same exact way you load contract in user.controller.js
const contractJson = require("../../client/src/contracts/Election.json");
const contractABI = contractJson.abi;
const contractAddress =
  contractJson.networks["5777"]?.address || process.env.CONTRACT_ADDRESS;

if (!contractAddress) {
  console.error(
    "Contract not deployed! Check Ganache or CONTRACT_ADDRESS in .env"
  );
  process.exit(1);
}

const web3 = new Web3("http://127.0.0.1:8545");
const contract = new web3.eth.Contract(contractABI, contractAddress);

export const createElection = async (req, res) => {
  try {
    const { name, date } = req.body;

    if (!name || !date) {
      return res.status(400).json({
        success: false,
        message: "Election name and date are required",
      });
    }

    // Just return the transaction data — MetaMask will sign it
    const data = contract.methods.createElection(name, date).encodeABI();

    return res.status(200).json({
      success: true,
      message: "Ready to send via MetaMask",
      txData: {
        to: contractAddress,
        data: data,
        value: "0x0",
      },
    });
  } catch (error) {
    console.error("Prepare election tx failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to prepare transaction",
    });
  }
};
