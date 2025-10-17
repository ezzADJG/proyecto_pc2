import app from "./app";
import pool from "./config/db"; 

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log("🔌 Conexión a la base de datos verificada con éxito.");
    client.release(); 

    app.listen(PORT, () => {
      console.log(
        `🚀 Servidor corriendo a toda velocidad en el puerto ${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ FATAL: No se pudo conectar a la base de datos.");
    console.error(error);
    process.exit(1);
  }
};

startServer();
