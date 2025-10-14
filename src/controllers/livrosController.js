import Livro from '../models/Livro.js';

// Criar novo livro
async function createLivro(req, res) {
  const {
    titulo,
    categorias,
    autores,
    editora,
    anoPublicacao,
    edicao,
    linkOnline,
    disponivel
  } = req.body;

  if (!titulo || !categorias || !autores || !editora || !anoPublicacao || !edicao || !disponivel) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  try {
    const novoLivro = await Livro.create({
      titulo,
      categorias,
      autores,
      editora,
      anoPublicacao,
      edicao,
      linkOnline,
      disponivel
    });

    res.status(201).json(novoLivro);
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({ error: 'Erro ao criar livro: ' + error.message });
  }
}

// Listar todos os livros
async function getLivros(req, res) {
  try {
    const livros = await Livro.findAll();
    res.json(livros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar livros: ' + error.message });
  }
}

// Obter livro por ID
async function getLivroById(req, res) {
  const { id } = req.params;

  try {
    const livro = await Livro.findByPk(id);
    if (livro) {
      res.json(livro);
    } else {
      res.status(404).json({ error: 'Livro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar livro: ' + error.message });
  }
}

// Atualizar livro
async function updateLivro(req, res) {
  const { id } = req.params;
  const {
    titulo,
    categorias,
    autores,
    editora,
    anoPublicacao,
    edicao,
    linkOnline,
    disponivel
  } = req.body;

  try {
    const livro = await Livro.findByPk(id);
    if (!livro) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    if (titulo) livro.titulo = titulo;
    if (categorias) livro.categorias = categorias;
    if (autores) livro.autores = autores;
    if (editora) livro.editora = editora;
    if (anoPublicacao) livro.anoPublicacao = anoPublicacao;
    if (edicao) livro.edicao = edicao;
    if (linkOnline !== undefined) livro.linkOnline = linkOnline;
    if (disponivel) livro.disponivel = disponivel;

    await livro.save();
    res.json(livro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar livro: ' + error.message });
  }
}

// Deletar livro
async function deleteLivro(req, res) {
  const { id } = req.params;

  try {
    const livro = await Livro.findByPk(id);
    if (!livro) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    await livro.destroy();
    res.json({ message: 'Livro excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir livro: ' + error.message });
  }
}

export default {
  createLivro,
  getLivros,
  getLivroById,
  updateLivro,
  deleteLivro
};
