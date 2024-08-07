// import express from 'express';

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import sequelize from "./config/db.js";
import cookieParser from "cookie-parser";
import routerAuth from "./routers/auth.js";
import routerCompany from "./routers/company.js";
import routerLocation from "./routers/location.js";
import routerIndustry from "./routers/industry_router.js";
import routerJob from "./routers/job_router.js";
import routerUser from "./routers/user_router.js";
import cors from 'cors'
import { authentication } from "./middleware/auth.js";
import bodyParser from "body-parser";


dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Thay đổi thành URL của bạn
  credentials:true, 
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));
// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// routes
app.get("/test", (req, res) => {
  res.status(200).send("<h1> Node js my sql</h1>");
});

app.use(authentication);

// ROUTER
app.use("/api/auth", routerAuth);
app.use("/api/company", routerCompany);
app.use("/api/location", routerLocation);
app.use("/api/industry", routerIndustry);
app.use("/api/job", routerJob);
app.use("/api/user", routerUser);

const PORT = process.env.PORT || 8080;

// MY SQL
sequelize
  .authenticate()
  .then(() => {
    console.log("MYSQL DB Connected");

    // Đồng bộ hóa các model với cơ sở dữ liệu và khởi động server
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
