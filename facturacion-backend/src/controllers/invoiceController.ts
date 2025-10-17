import { Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middlewares/authMiddleware";
import { v4 as uuidv4 } from "uuid";

export const createInvoice = async (req: AuthRequest, res: Response) => {
  const { invoice_type, customer_name, customer_document, total, items } =
    req.body;
  const userId = req.user?.id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Iniciar transacción

    // 1. Insertar la factura principal
    const invoiceId = uuidv4();
    const invoiceResult = await client.query(
      "INSERT INTO invoices (id, invoice_type, customer_name, customer_document, total, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [invoiceId, invoice_type, customer_name, customer_document, total, userId]
    );
    const newInvoiceId = invoiceResult.rows[0].id;

    // 2. Insertar los items y actualizar el stock
    for (const item of items) {
      const itemId = uuidv4();
      // --- MODIFICA ESTA CONSULTA ---
      await client.query(
        "INSERT INTO invoice_items (id, invoice_id, product_name, quantity, unit_price, subtotal, product_code) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          itemId,
          newInvoiceId,
          item.name,
          item.quantity,
          item.price,
          item.quantity * item.price,
          item.code,
        ]
      );
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE code = $2 AND user_id = $3",
        [item.quantity, item.code, userId]
      );
    }

    await client.query("COMMIT"); // Confirmar transacción
    res
      .status(201)
      .json({ message: "Factura creada con éxito.", invoiceId: newInvoiceId });
  } catch (error) {
    await client.query("ROLLBACK"); // Revertir en caso de error
    console.error(error);
    res.status(500).json({ message: "Error al crear la factura." });
  } finally {
    client.release(); // Liberar la conexión
  }
};

export const getMyInvoices = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    // Seleccionamos todas las facturas del usuario, ordenadas por fecha
    const result = await pool.query(
      "SELECT id, invoice_type, customer_name, customer_document, total, created_at FROM invoices WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las facturas." });
  }
};

export const getInvoiceById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // ID de la factura
  const userId = req.user?.id;

  try {
    // 1. Obtenemos los datos principales de la factura
    const invoiceResult = await pool.query(
      "SELECT * FROM invoices WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ message: "Factura no encontrada." });
    }

    // 2. Obtenemos los items (productos) de esa factura
    const itemsResult = await pool.query(
      "SELECT * FROM invoice_items WHERE invoice_id = $1",
      [id]
    );

    const invoice = invoiceResult.rows[0];
    invoice.items = itemsResult.rows; // Añadimos los items al objeto de la factura

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener el detalle de la factura." });
  }
};
