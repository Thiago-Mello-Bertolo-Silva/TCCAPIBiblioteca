// controllers/dashboardController.js
import { Sequelize } from 'sequelize';
import Livro from '../models/Livro.js';

export async function livrosPorMes(req, res) {
  try {
    const resultados = await Livro.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%b'), 'mes'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'livros'],
      ],
      group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
      order: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
    });

    const data = resultados.map((r) => ({
      mes: r.get('mes'),
      livros: Number(r.get('livros')),
    }));

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar livros por mês:', error);
    res.status(500).json({ error: 'Erro ao buscar dados de livros por mês' });
  }
}
