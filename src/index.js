import express  from 'express';
import dbConnection from './config';
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const swaggerUi = require('swagger-ui-express')
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
dbConnection();


const swagerFile = require('../docs/swagger_output.json');

//import routes 
import { adminRouter, districtRouter,examRouter, parentRouter, schoolRouter, sessionRouter, staffRouter, studentRouter, subjectRouter, teacherRouter } from "./app"; 

// middleware -
app.use(morgan("dev"));
app.use(bodyParser.json());
//app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use("/api/v1", adminRouter);
app.use("/api/v1", districtRouter);
app.use("/api/v1", examRouter);
app.use("/api/v1", parentRouter);
app.use("/api/v1", sessionRouter);
app.use("/api/v1", staffRouter);
app.use("/api/v1", studentRouter);
app.use("/api/v1", subjectRouter);
app.use("/api/v1", schoolRouter);
app.use("/api/v1", studentRouter);
app.use("/api/v1", teacherRouter);


app.use('/api/v1', swaggerUi.serve, swaggerUi.setup(swagerFile));
app.use("/api", (req, res)=>{
    res.json({message:"hellow word"});
});

app.use("/", (req, res)=>{
    res.json({message:"hellow word", doc:"https://iemis.herokuapp.com/api/v1/"});
});

app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: "Unauthorized!" });
    }
});

export default app;