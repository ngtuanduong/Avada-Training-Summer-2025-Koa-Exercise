const Router = require("@koa/router");
const path = require("path");
const fs = require("fs");

const router = new Router();

// Render the product list page with sorting, pagination, and filtering
router.get(["/", "/products"], async (ctx) => {
    // Read all products from the JSON file
    const products = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../database/products.json"),
            "utf-8"
        )
    );
    // Pagination and sorting setup
    const page = Number(ctx.query.page) || 1;
    const pageSize = 20;
    const totalPages = Math.ceil(products.length / pageSize);
    const orderBy = ctx.query.orderBy || "createdAt";
    const sort = ctx.query.sort || "desc";
    // Sort products by the selected field and direction
    products.sort((a, b) => {
        if (orderBy === "price") {
            return sort === "asc"
                ? Number(a[orderBy]) - Number(b[orderBy])
                : Number(b[orderBy]) - Number(a[orderBy]);
        } else if (
            orderBy === "name" ||
            orderBy === "product" ||
            orderBy === "color"
        ) {
            return sort === "asc"
                ? String(a[orderBy]).localeCompare(String(b[orderBy]))
                : String(b[orderBy]).localeCompare(String(a[orderBy]));
        } else {
            return sort === "asc"
                ? new Date(a[orderBy]) - new Date(b[orderBy])
                : new Date(b[orderBy]) - new Date(a[orderBy]);
        }
    });
    // Paginate the sorted products
    const paginated = products.slice((page - 1) * pageSize, page * pageSize);
    // Render the products.ejs view
    await ctx.render("products", {
        products: paginated,
        totalPages,
        currentPage: page,
        orderBy: ctx.query.orderBy,
        sort: ctx.query.sort,
    });
});

// Render the product detail page
router.get("/products/:id", async (ctx) => {
    const id = Number(ctx.params.id);
    // Read all products from the JSON file
    const products = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../database/products.json"),
            "utf-8"
        )
    );
    // Find the product by ID
    const product = products.find((p) => p.id === id);
    if (!product) {
        ctx.status = 404;
        ctx.body = "Product not found";
        return;
    }
    // Format createdAt as dd/mm/yyyy for display
    const d = new Date(product.createdAt);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const formattedProduct = {
        ...product,
        createdAt: `${day}/${month}/${year}`,
    };
    // Render the product.ejs view
    await ctx.render("product", { product: formattedProduct });
});

// Render the add product form page
router.get("/products/add", async (ctx) => {
    await ctx.render("addProduct");
});

module.exports = router;
