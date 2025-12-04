// import express from "express";
// import session from "express-session";
// import dotenv from "dotenv";
// import cors from "cors";
// import chalk from "chalk"; // Added for colored console logs
// import routes from "./routes/index.js";
// import adminRoutes from "./routes/admin.routes.js";
// import connDB from "./config/db.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000; // Fallback port
// const ENV = process.env.NODE_ENV || "development";

// // Middleware
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "52d6d856059bab7517f7ae35efad2970bfbf778467bf41cc9e4efff74e55e30c",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // Secure cookies in production (requires HTTPS)
//       httpOnly: true,
//       sameSite: "strict",
//     },
//   })
// );

// app.use(cors({
//   origin: "http://localhost:3000", // Allow frontend origin
//   credentials: true, // Allow cookies/session to be sent
// }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Database connection
// connDB();

// // Routes
// app.use("/api", routes); // Main routes (e.g., /api/user/login)
// app.use("/api/admin", adminRoutes); // Admin routes

// // Start server
// app.listen(PORT, () => {
//   console.log(chalk.yellow.bold(`Server running on port ${PORT} in ${ENV} mode.`));
// });
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import connDB from "./config/db.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT;
const ENV = process.env.NODE_ENV;

app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Only allow frontend origin
    credentials: true, // ✅ Allow cookies/auth headers
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connDB();
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} in ${ENV} mode.`.yellow.bold);
});
