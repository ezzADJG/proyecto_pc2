import { Request, Response } from "express";
import axios from "axios";

const API_BASE_URL = "https://api.decolecta.com/v1";
const API_TOKEN = process.env.DECOLECTA_API_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const getRuc = async (req: Request, res: Response) => {
  const { numero } = req.params;
  try {
    const response = await api.get(`/sunat/ruc?numero=${numero}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al consultar RUC." });
  }
};

export const getDni = async (req: Request, res: Response) => {
  const { numero } = req.params;
  try {
    const response = await api.get(`/reniec/dni?numero=${numero}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al consultar DNI." });
  }
};

export const getExchangeRate = async (req: Request, res: Response) => {
  try {
    const response = await api.get("/tipo-cambio/sbs/average?currency=USD");
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tipo de cambio." });
  }
};
