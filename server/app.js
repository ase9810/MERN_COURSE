const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
//요청에 대한 정보를 콘솔에 기록하는 미들웨어
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

const api = process.env.API_URL;
const productsRouter = require("./routes/product");
const categoriesRouter = require("./routes/category");
const usersRouter = require("./routes/user"); /*  */
const ordersRouter = require("./routes/order"); /*  */

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(errorHandler);

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

mongoose
	.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Database Connection is ready...");
	})
	.catch((err) => {
		console.log(err);
	});

// Development
// app.listen(3000, () => {
// 	console.log("server is running http://localhost:3000");
// });

// Production
var server = app.listen(process.env.PORT || 3000, function () {
	var port = server.address().port;
	console.log("Express is working on port " + port);
});
