import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import externalApiRoutes from "./routes/externalApiRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Para parsear body de peticiones como JSON

// Rutas de la API
app.get("/api", (req, res) => {
  res.send("API del Sistema de Facturación funcionando correctamente!");
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/external", externalApiRoutes);
app.use('/api/dashboard', dashboardRoutes);

export default app;
