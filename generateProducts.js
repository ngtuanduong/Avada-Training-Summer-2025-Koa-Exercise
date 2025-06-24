const fs = require("fs");
const { faker } = require("@faker-js/faker");

const products = [];

for (let i = 1; i <= 1000; i++) {
    products.push({
        id: i,
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price({ min: 5, max: 500, dec: 0 })),
        description: faker.commerce.productDescription(),
        product: faker.commerce.product(),
        color: faker.color.human(),
        createdAt: faker.date.past({ years: 2 }).toISOString(),
        image: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
    });
}

fs.writeFileSync(
    "src/database/products.json",
    JSON.stringify(products, null, 2),
    "utf-8"
);

console.log("Generated 1000 products to products.json");
