const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const router = require("./routes/routes");
const views = require("koa-views");
const path = require("path");
const fs = require("fs");
const serve = require("koa-static");

const app = new Koa();

app.use(serve(path.join(__dirname, "styles")));
app.use(bodyParser());
app.use(views(path.join(__dirname, "views"), { extension: "ejs" }));
app.use(router.routes()).use(router.allowedMethods());

// HTML page to render all products
app.use(async (ctx, next) => {
    if (
        ctx.path === "/" ||
        (ctx.path === "/products" && ctx.method === "GET")
    ) {
        const products = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "database", "products.json"),
                "utf-8"
            )
        );
        const page = Number(ctx.query.page) || 1;
        const pageSize = 20;
        const totalPages = Math.ceil(products.length / pageSize);
        const paginated = products.slice(
            (page - 1) * pageSize,
            page * pageSize
        );
        await ctx.render("products", {
            products: paginated,
            totalPages,
            currentPage: page,
        });
        return;
    }
    // HTML page to render a single product
    const match = ctx.path.match(/^\/products\/(\d+)$/);
    if (match && ctx.method === "GET") {
        const id = Number(match[1]);
        const products = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "database", "products.json"),
                "utf-8"
            )
        );
        const product = products.find((p) => p.id === id);
        if (!product) {
            ctx.status = 404;
            ctx.body = "Product not found";
            return;
        }
        // Format createdAt as dd/mm/yyyy
        const d = new Date(product.createdAt);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const formattedProduct = {
            ...product,
            createdAt: `${day}/${month}/${year}`,
        };
        await ctx.render("product", { product: formattedProduct });
        return;
    }
    await next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
