const express = require("express");
const cors = require("cors");
const app = express();
const port = 3002;

const payPalRoute = require("./src/route/paypalRoute.js");
const razerRoute = require("./src/route/razerRoute.js");
const addRoute = require("./src/route/addRoute.js");

require("./src/config/dbConfig.js");

app.use(express.json());


// const corsOptions = {
//     origin: ["http://localhost:3000"],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     optionsSuccessStatus: 204,
//   };
app.use(cors());
// app.use(cors(corsOptions));
app.use('/api/paypal', payPalRoute);
app.use('/api/razor', razerRoute);
app.use('/api/add', addRoute);

app.options('*', cors());

app.listen(port, () => {
    console.log("Server started at port: " + port);
});


































