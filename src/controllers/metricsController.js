import { Op } from "sequelize";
import Livro from "../models/Livro.js";
import Usuario from "../models/Usuario.js";
import Emprestimo from "../models/Emprestimo.js";

async function getDashboardMetrics(req, res) {
  try {
    // Total de livros registrados
    const totalLivros = await Livro.count();

    // Total de usuários registrados
    const totalUsuarios = await Usuario.count();

    // Livros emprestados no momento (status diferente de "Concluído")
    const livrosEmprestados = await Emprestimo.count({
      where: {
        status: {
          [Op.ne]: "Concluído"
        }
      }
    });

    return res.json({
      totalLivros,
      totalUsuarios,
      livrosEmprestados
    });
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getInfracoesChartData(req, res) {
  try {
    return res.json([]);
  } catch (error) {
    console.error("Erro ao buscar dados do gráfico:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export default {
  getDashboardMetrics,
  getInfracoesChartData
};
