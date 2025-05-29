import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

import './src/models/Assossiation.js';
import router from './src/routes/router.js';

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Substitua pelo domínio real do frontend em produção
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use(router);

app.listen(3000, () => {
  console.log('O servidor está escutando na porta 3000.');
});
