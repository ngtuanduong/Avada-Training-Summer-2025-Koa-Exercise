const fs = require("fs");
const path = require("path");

const PRODUCTS_PATH = path.join(__dirname, "../../database/products.json");

// Read all products from the JSON file
function readProducts() {
    return JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf-8"));
}
// Write the products array to the JSON file
function writeProducts(products) {
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
}

// GET /api/products
// Return a list of products, with optional sorting, ordering, and limiting
function getAllProducts(ctx) {
    let products = readProducts();
    const { limit, sort, orderBy } = ctx.query;
    const sortField = orderBy || "createdAt";
    if (sort === "asc") {
        products = products.sort((a, b) => {
            if (sortField === "price") {
                return Number(a[sortField]) - Number(b[sortField]);
            } else if (
                sortField === "name" ||
                sortField === "product" ||
                sortField === "color"
            ) {
                return String(a[sortField]).localeCompare(String(b[sortField]));
            } else {
                return new Date(a[sortField]) - new Date(b[sortField]);
            }
        });
    } else if (sort === "desc") {
        products = products.sort((a, b) => {
            if (sortField === "price") {
                return Number(b[sortField]) - Number(a[sortField]);
            } else if (
                sortField === "name" ||
                sortField === "product" ||
                sortField === "color"
            ) {
                return String(b[sortField]).localeCompare(String(a[sortField]));
            } else {
                return new Date(b[sortField]) - new Date(a[sortField]);
            }
        });
    }
    if (limit) {
        products = products.slice(0, Number(limit));
    }
    ctx.body = products;
}

// POST /api/products
// Create a new product and add it to the list
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
// Update an existing product by ID
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
// Delete a product by ID
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
// Return a single product by ID, with optional field selection
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
