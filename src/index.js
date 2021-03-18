
import express from 'express';
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
/**
 * import routes
 */
import adminRouter from './app/admin'

// middleware -
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use("/api/v1", adminRouter);


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