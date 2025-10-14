import { Op, fn, col, literal } from "sequelize";
import Livro from "../models/Livro.js";
import Usuario from "../models/Usuario.js";
import Emprestimo from "../models/Emprestimo.js";

async function getDashboardMetrics(req, res) {
  try {
    const totalLivros = await Livro.count();
    const totalUsuarios = await Usuario.count();
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
      totalEmprestimos: livrosEmprestados
    });
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// Novo endpoint com dados extras para os gráficos
async function getDashboardExtraMetrics(req, res) {
  try {
    // Top 5 livros mais emprestados
    const topLivros = await Emprestimo.findAll({
      attributes: [
        "livroId",
        [fn("COUNT", col("livroId")), "total"]
      ],
      include: {
        model: Livro,
        attributes: ["titulo"]
      },
      group: ["livroId", "Livro.livroId"],
      order: [[literal("total"), "DESC"]],
      limit: 5
    });

    // Empréstimos por mês (últimos 6 meses)
    const emprestimosPorMes = await Emprestimo.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "mes"],
        [fn("COUNT", "*"), "total"]
      ],
      group: [fn("DATE_FORMAT", col("createdAt"), "%Y-%m")],
      order: [[literal("mes"), "DESC"]],
      limit: 6
    });

    // Usuários cadastrados por mês (últimos 6 meses)
    const usuariosPorMes = await Usuario.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "mes"],
        [fn("COUNT", "*"), "total"]
      ],
      group: [fn("DATE_FORMAT", col("createdAt"), "%Y-%m")],
      order: [[literal("mes"), "DESC"]],
      limit: 6
    });

    return res.json({
      topLivros,
      emprestimosPorMes,
      usuariosPorMes
    });
  } catch (error) {
    console.error("Erro ao buscar dados extras do dashboard:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export default {
  getDashboardMetrics,
  getDashboardExtraMetrics
};
