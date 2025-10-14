import emprestimosService from '../services/emprestimosService.js';
import Emprestimo from '../models/Emprestimo.js';
import Usuario from '../models/Usuario.js';
import Livro from '../models/Livro.js';
import Notificacao from '../models/notificacao.js';

// Criar novo empréstimo
async function createEmprestimo(req, res) {
  const {
    usuarioId,
    livroId,
    dataInicio,
    dataPrevistoDevolucao,
    status
  } = req.body;

  if (!usuarioId || !livroId || !dataInicio || !dataPrevistoDevolucao || !status) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  try {
    const novoEmprestimo = await emprestimosService.criarEmprestimo({
      usuarioId,
      livroId,
      dataInicio,
      dataPrevistoDevolucao,
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
      attributes: [
        'id',
        'usuarioId',
        'livroId',
        'dataInicio',
        'dataPrevistoDevolucao',
        'status'
      ],
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
    dataPrevistoDevolucao,
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
      dataPrevistoDevolucao,
      status
    });

    // Se o status foi atualizado para "Concluído", remover as notificações
    if (status === 'Concluído' && usuarioId) {
      await Notificacao.destroy({
        where: { usuarioId }
      });
    }

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

    // Deleta notificações associadas ao usuário
    await Notificacao.destroy({
      where: { usuarioId: emprestimo.usuarioId }
    });

    // Deleta o empréstimo
    await emprestimosService.deletarEmprestimo(id);

    res.json({ message: 'Empréstimo excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir empréstimo: ' + error.message });
  }
}

async function getEmprestimosDoUsuario(req, res) {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const emprestimos = await Emprestimo.findAll({
      where: { usuarioId },
      attributes: [
        'id',
        'livroId',
        'dataInicio',
        'dataPrevistoDevolucao',
        'status'
      ],
      include: [
        {
          model: Livro,
          attributes: ['titulo']
        }
      ]
    });

    res.json(emprestimos);
  } catch (error) {
    console.error('Erro ao buscar empréstimos do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar empréstimos do usuário: ' + error.message });
  }
}

// Retorna apenas os empréstimos ativos do usuário
async function getEmprestimosAtivosByUsuario(req, res) {
  try {
    const usuarioId = req.usuario?.id; // vem do token
    if (!usuarioId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const emprestimos = await Emprestimo.findAll({
      where: { usuarioId, status: { [Op.ne]: "Concluído" } },
      include: [{ model: Livro }, { model: Usuario }],
      order: [["dataInicio", "DESC"]], // cuidado: no seu código estava "dataEmprestimo", mas a tabela usa "dataInicio"
    });

    res.json(emprestimos);
  } catch (error) {
    console.error("Erro ao buscar empréstimos ativos:", error);
    res.status(500).json({ error: "Erro ao buscar empréstimos ativos." });
  }
}

// Retorna o último livro emprestado pelo usuário
async function getUltimoEmprestimoByUsuario(req, res) {
  try {
    const usuarioId = req.usuario?.id; // vem do token
    if (!usuarioId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const ultimoEmprestimo = await Emprestimo.findOne({
      where: { usuarioId },
      include: [{ model: Livro }, { model: Usuario }],
      order: [["dataInicio", "DESC"]],
    });

    if (!ultimoEmprestimo) {
      return res.status(404).json({ message: "Nenhum empréstimo encontrado." });
    }

    res.json(ultimoEmprestimo);
  } catch (error) {
    console.error("Erro ao buscar último empréstimo:", error);
    res.status(500).json({ error: "Erro ao buscar último empréstimo." });
  }
}

export default {
  createEmprestimo,
  getEmprestimos,
  getEmprestimoById,
  updateEmprestimo,
  deleteEmprestimo,
  getEmprestimosDoUsuario,
  getEmprestimosAtivosByUsuario,
  getUltimoEmprestimoByUsuario
};
