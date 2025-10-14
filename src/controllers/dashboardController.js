// controllers/dashboardController.js
import { Sequelize } from 'sequelize';
import Livro from '../models/Livro.js';

export async function livrosPorAutores(req, res) {
  try {
    const livros = await Livro.findAll({
      attributes: ['autores'],
      raw: true,
    });

    const contagemAutores = {};

    for (const livro of livros) {
      const autoresStr = livro.autores;
      const autores = autoresStr.split(",").map((a) => a.trim());

      autores.forEach((autor) => {
        if (autor) {
          contagemAutores[autor] = (contagemAutores[autor] || 0) + 1;
        }
      });
    }

    const resultado = Object.entries(contagemAutores).map(([autor, quantidade]) => ({
      autores: autor,
      quantidade,
    }));

    // Ordena por quantidade decrescente
    resultado.sort((a, b) => b.quantidade - a.quantidade);

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao processar autores:', error);
    res.status(500).json({ error: 'Erro ao buscar livros por autores' });
  }
}

export async function livrosPorEditora(req, res) {
  try {
    const resultados = await Livro.findAll({
      attributes: [
        'editora',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade'],
      ],
      group: ['editora'],
      order: [[Sequelize.literal('quantidade'), 'DESC']],
      raw: true,
    });

    res.json(resultados);
  } catch (error) {
    console.error('Erro ao buscar livros por editora:', error);
    res.status(500).json({ error: 'Erro ao buscar livros por editora' });
  }
}
