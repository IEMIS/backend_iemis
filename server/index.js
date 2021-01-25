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
    .connect(process.env.MONGO_URI, {useUnifiedTopology:true, useNewUrlParser:true, keepAlive:true,})
    .then(() => console.log(`Database is connected on port ${port}`));
mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

const swagerFile = require('../swagger_output.json');


// bring in routes
//const postRoutes = require("./routes/post");
const studentAuthRoutes = require("../routes/students");
//const userRoutes = require("./routes/user");
// apiDocs




/*
app.get("/api", (req, res) => {
    fs.readFile("docs/apiDocs.json", (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});
*/
// middleware -
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(expressValidator);
app.use(cors());

app.use("/api/v1", studentAuthRoutes);
app.use("/api", (req, res)=>{
    res.json(req.body);
});
//app.use("/api", userRoutes);



app.use('/api/v1', swaggerUi.serve, swaggerUi.setup(swagerFile));

app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: "Unauthorized!" });
    }
});


app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});
