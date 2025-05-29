import { Op } from 'sequelize';
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

// Verifica se ainda há algum empréstimo registrado para o livro
async function verificarEAtualizarDisponibilidade(livroId) {
  const emprestimosRestantes = await Emprestimo.findAll({
    where: { livroId }
  });

  if (emprestimosRestantes.length === 0) {
    await atualizarDisponibilidadeLivro(livroId, 'Sim');
  }
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

// Deleta um empréstimo e atualiza o status do livro se necessário
async function deletarEmprestimo(id) {
  const emprestimo = await Emprestimo.findByPk(id);

  if (!emprestimo) {
    throw new Error('Empréstimo não encontrado.');
  }

  const livroId = emprestimo.livroId;

  // ⚠️ Aguarda a exclusão efetiva no banco
  await emprestimo.destroy();

  // ⚠️ Verifica após o empréstimo ter sido removido
  await verificarEAtualizarDisponibilidade(livroId);

  return { message: 'Empréstimo deletado com sucesso e status do livro atualizado.' };
}

// Atualiza os dados do empréstimo e verifica a disponibilidade do livro
async function atualizarEmprestimo(id, dadosAtualizados) {
  const emprestimo = await Emprestimo.findByPk(id);

  if (!emprestimo) {
    throw new Error('Empréstimo não encontrado.');
  }

  const livroIdAntes = emprestimo.livroId;

  await emprestimo.update({
    usuarioId: dadosAtualizados.usuarioId ?? emprestimo.usuarioId,
    livroId: dadosAtualizados.livroId ?? emprestimo.livroId,
    dataInicio: dadosAtualizados.dataInicio ?? emprestimo.dataInicio,
    dataPrevistoDevolucao: dadosAtualizados.dataPrevistoDevolucao ?? emprestimo.dataPrevistoDevolucao,
    status: dadosAtualizados.status ?? emprestimo.status,
  });

  // Verifica disponibilidade do livro anterior
  await verificarEAtualizarDisponibilidade(livroIdAntes);

  return emprestimo;
}

export default {
  criarEmprestimo,
  atualizarEmprestimo,
  verificarDisponibilidadeLivro,
  atualizarDisponibilidadeLivro,
  deletarEmprestimo
};
