import Livro from '../models/Livro.js';
import Emprestimo from '../models/Emprestimo.js';

// Verifica se o livro está disponível para empréstimo
async function verificarDisponibilidadeLivro(livroId) {
  const livro = await Livro.findByPk(livroId);

  if (!livro) {
    throw new Error('Livro não encontrado.');
  }

  if (livro.disponivel !== 'Sim') {
    throw new Error('Livro não está disponível para empréstimo.');
  }

  return livro;
}

// Atualiza o status de disponibilidade do livro
async function atualizarDisponibilidadeLivro(livroId, status) {
  const livro = await Livro.findByPk(livroId);

  if (!livro) {
    throw new Error('Livro não encontrado para atualização.');
  }

  livro.disponivel = status;
  await livro.save();
}

// Cria um novo empréstimo
async function criarEmprestimo(dadosEmprestimo) {
  const { livroId } = dadosEmprestimo;

  // Verificar disponibilidade antes de criar
  await verificarDisponibilidadeLivro(livroId);

  // Criar o empréstimo
  const novoEmprestimo = await Emprestimo.create(dadosEmprestimo);

  // Atualizar livro para "Não disponível"
  await atualizarDisponibilidadeLivro(livroId, 'Não');

  return novoEmprestimo;
}

// Atualizar status do empréstimo
async function atualizarEmprestimo(id, dadosAtualizados) {
  const emprestimo = await Emprestimo.findByPk(id);

  if (!emprestimo) {
    throw new Error('Empréstimo não encontrado.');
  }

  if (dadosAtualizados.status === 'devolvido') {
    await atualizarDisponibilidadeLivro(emprestimo.livroId, 'Sim');
  }

  await emprestimo.update({
    usuarioId: dadosAtualizados.usuarioId ?? emprestimo.usuarioId,
    livroId: dadosAtualizados.livroId ?? emprestimo.livroId,
    dataInicio: dadosAtualizados.dataInicio ?? emprestimo.dataInicio,
    dataPrevistoDevolucao: dadosAtualizados.dataPrevistoDevolucao ?? emprestimo.dataPrevistoDevolucao,
    status: dadosAtualizados.status ?? emprestimo.status,
  });

  return emprestimo;
}

export default {
  criarEmprestimo,
  atualizarEmprestimo,
  verificarDisponibilidadeLivro,
  atualizarDisponibilidadeLivro
};
