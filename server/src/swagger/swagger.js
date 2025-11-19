// src/swagger/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "APIs for Admin, Seller, Buyer in E-Commerce",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
  },
  apis: [
    "./src/routes/*.js", // Point to all route files
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📚 Swagger documentation available at http://localhost:5000/api-docs");
};