const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const swaggerUi = require('swagger-ui-express')
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();


const port = process.env.PORT || 9000;

// MONGO_URI=mongodb://localhost/nodeapi
mongoose
    .connect(process.env.MONGO_URI, {useCreateIndex: true,useUnifiedTopology:true, useNewUrlParser:true, keepAlive:true,})
    .then(() => console.log(`Database is connected on port ${port}`));
mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

const swagerFile = require('../docs/swagger_output.json');


// bring in routes

const studentAuthRoutes = require("../routes/students");
const adminRoutes = require("../routes/admin")


// middleware -
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(expressValidator());
app.use(cors());


/**
 * listen the endpoit in url orders 
 */
app.use("/api/v1", adminRoutes);
app.use("/api/v1", studentAuthRoutes);

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


app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});
