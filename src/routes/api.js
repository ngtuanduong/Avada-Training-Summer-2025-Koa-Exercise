const Router = require("@koa/router");
const productHandlers = require("../handlers/products/productHandlers");
const ProductInputMiddleware = require("../middleware/ProductInputMiddleware");

const router = new Router();

// Get all products (with optional limit, sort, orderBy)
router.get("/api/products", productHandlers.getAllProducts);

// Create a new product
router.post(
    "/api/products",
    ProductInputMiddleware,
    productHandlers.createProduct
);

// Update a product by id
router.put(
    "/api/product/:id",
    ProductInputMiddleware,
    productHandlers.updateProduct
);

// Delete a product by id
router.delete("/api/product/:id", productHandlers.deleteProduct);

// Get one product by id (with optional fields)
router.get("/api/product/:id", productHandlers.getProductById);

module.exports = router;
