const fs = require("fs");
const path = require("path");

const PRODUCTS_PATH = path.join(__dirname, "../../database/products.json");

function readProducts() {
    return JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf-8"));
}
function writeProducts(products) {
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
}

// GET /api/products
function getAllProducts(ctx) {
    let products = readProducts();
    const { limit, sort } = ctx.query;
    if (sort === "asc") {
        products = products.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
    } else if (sort === "desc") {
        products = products.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
    if (limit) {
        products = products.slice(0, Number(limit));
    }
    ctx.body = products;
}

// POST /api/products
function createProduct(ctx) {
    const products = readProducts();
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        ...ctx.request.body,
        createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    writeProducts(products);
    ctx.status = 201;
    ctx.body = newProduct;
}

// PUT /api/product/:id
function updateProduct(ctx) {
    const products = readProducts();
    const id = Number(ctx.params.id);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) {
        ctx.status = 404;
        ctx.body = { error: "Product not found" };
        return;
    }
    products[idx] = { ...products[idx], ...ctx.request.body };
    writeProducts(products);
    ctx.body = products[idx];
}

// DELETE /api/product/:id
function deleteProduct(ctx) {
    let products = readProducts();
    const id = Number(ctx.params.id);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) {
        ctx.status = 404;
        ctx.body = { error: "Product not found" };
        return;
    }
    const deleted = products[idx];
    products = products.filter((p) => p.id !== id);
    writeProducts(products);
    ctx.body = deleted;
}

// GET /api/product/:id
function getProductById(ctx) {
    const products = readProducts();
    const id = Number(ctx.params.id);
    const product = products.find((p) => p.id === id);
    if (!product) {
        ctx.status = 404;
        ctx.body = { error: "Product not found" };
        return;
    }
    const { fields } = ctx.query;
    if (fields) {
        const picked = {};
        fields.split(",").forEach((f) => {
            if (product[f] !== undefined) picked[f] = product[f];
        });
        ctx.body = picked;
    } else {
        ctx.body = product;
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
};
