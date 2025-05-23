import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';


dotenv.config();

import router from './src/routes/router.js';

const app = express(); // INICIALIZA AQUI

app.use(cors({
  origin: "*",
  methods: ["*"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use(router);

app.listen(3000, () => {
  console.log('O servidor está escutando na porta 3000.');
});
