const Router = require("@koa/router");
const productHandlers = require("../handlers/products/productHandlers");
const ProductInputMiddleware = require("../middleware/ProductInputMiddleware");

const router = new Router();

// GET all products with optional limit and sort
router.get("/api/products", productHandlers.getAllProducts);

// POST create a new product
router.post(
    "/api/products",
    ProductInputMiddleware,
    productHandlers.createProduct
);

// PUT update a product by id
router.put(
    "/api/product/:id",
    ProductInputMiddleware,
    productHandlers.updateProduct
);

// DELETE a product by id
router.delete("/api/product/:id", productHandlers.deleteProduct);

// GET one product by id with optional fields
router.get("/api/product/:id", productHandlers.getProductById);

module.exports = router;
