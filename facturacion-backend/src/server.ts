import app from "./app";
import pool from "./config/db"; // Importamos el pool de la base de datos

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Intentamos hacer una consulta simple para verificar la conexión
    const client = await pool.connect();
    console.log("🔌 Conexión a la base de datos verificada con éxito.");
    client.release(); // Liberamos el cliente

    // 2. Si la conexión fue exitosa, iniciamos el servidor
    app.listen(PORT, () => {
      console.log(
        `🚀 Servidor corriendo a toda velocidad en el puerto ${PORT}`
      );
    });
  } catch (error) {
    // 3. Si la conexión falla, mostramos el error y detenemos todo
    console.error("❌ FATAL: No se pudo conectar a la base de datos.");
    console.error(error);
    process.exit(1); // Terminamos el proceso con un código de error
  }
};

// Llamamos a la función para iniciar todo
startServer();
