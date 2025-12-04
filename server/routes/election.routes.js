// routes/election.routes.js
import express from "express";
import { createElection } from "../controller/electionController.js";

const router = express.Router();

router.post("/create", createElection);

export default router;
