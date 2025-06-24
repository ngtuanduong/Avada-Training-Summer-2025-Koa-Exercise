// Import required modules
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const views = require("koa-views");
const path = require("path");
const serve = require("koa-static");
const htmlRouter = require("./routes/html"); // HTML page routes
const apiRouter = require("./routes/api"); // API routes

const app = new Koa(); // Create Koa app instance

// Serve static files (CSS, images, etc.) from the styles directory
app.use(serve(path.join(__dirname, "styles")));

// Parse JSON and urlencoded request bodies
app.use(bodyParser());

// Set up EJS view rendering from the views directory
app.use(views(path.join(__dirname, "views"), { extension: "ejs" }));

// Register HTML page routes (product list, detail, add form)
app.use(htmlRouter.routes()).use(htmlRouter.allowedMethods());

// Register API routes (RESTful product API)
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

// Start the server on the specified port (default: 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
