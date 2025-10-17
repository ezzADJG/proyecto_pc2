import { Router } from "express";
import { getDni, getExchangeRate, getRuc } from "../controllers/externalApiController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Protegemos estas rutas para que solo usuarios logueados puedan usarlas
router.get("/dni/:numero", protect, getDni);
router.get("/tipo-cambio", protect, getExchangeRate);
router.get("/ruc/:numero", protect, getRuc);

export default router;
