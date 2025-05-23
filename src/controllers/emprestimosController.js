import Emprestimo from '../models/Emprestimo.js';
import emprestimosService from '../services/emprestimosService.js';
import Usuario from '../models/Usuario.js';
import Livro from '../models/Livro.js';

// Criar novo empréstimo
async function createEmprestimo(req, res) {
  const {
    usuarioId,
    livroId,
    dataInicio,
    dataEmprestimo,
    status
  } = req.body;

  if (!usuarioId || !livroId || !dataInicio || !dataEmprestimo || !status) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  try {
    const novoEmprestimo = await emprestimosService.criarEmprestimo({
      usuarioId,
      livroId,
      dataInicio,
      dataEmprestimo,
      status
    });

    res.status(201).json(novoEmprestimo);
  } catch (error) {
    console.error('Erro ao criar empréstimo:', error);
    res.status(500).json({ error: 'Erro ao criar empréstimo: ' + error.message });
  }
}

// Listar todos os empréstimos com nome do usuário e do livro
async function getEmprestimos(req, res) {
  try {
    const emprestimos = await Emprestimo.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['nome']
        },
        {
          model: Livro,
          attributes: ['titulo']
        }
      ]
    });

    res.json(emprestimos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar empréstimos: ' + error.message });
  }
}

// Obter empréstimo por ID
async function getEmprestimoById(req, res) {
  const { id } = req.params;

  try {
    const emprestimo = await Emprestimo.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['nome']
        },
        {
          model: Livro,
          attributes: ['titulo']
        }
      ]
    });

    if (emprestimo) {
      res.json(emprestimo);
    } else {
      res.status(404).json({ error: 'Empréstimo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar empréstimo: ' + error.message });
  }
}

// Atualizar empréstimo
async function updateEmprestimo(req, res) {
  const { id } = req.params;
  const {
    usuarioId,
    livroId,
    dataInicio,
    dataEmprestimo,
    status,
  } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status é obrigatório para atualização.' });
  }

  try {
    const emprestimoAtualizado = await emprestimosService.atualizarEmprestimo(id, {
      usuarioId,
      livroId,
      dataInicio,
      dataEmprestimo,
      status
    });

    res.json(emprestimoAtualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar empréstimo: ' + error.message });
  }
}

// Deletar empréstimo
async function deleteEmprestimo(req, res) {
  const { id } = req.params;

  try {
    const emprestimo = await Emprestimo.findByPk(id);
    if (!emprestimo) {
      return res.status(404).json({ error: 'Empréstimo não encontrado' });
    }

    await emprestimo.destroy();
    res.json({ message: 'Empréstimo excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir empréstimo: ' + error.message });
  }
}

export default {
  createEmprestimo,
  getEmprestimos,
  getEmprestimoById,
  updateEmprestimo,
  deleteEmprestimo
};
