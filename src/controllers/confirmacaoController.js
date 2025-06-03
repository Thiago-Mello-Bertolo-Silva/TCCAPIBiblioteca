import jwt from 'jsonwebtoken';
import usuariosController from './usuariosController.js';

const confirmacaoController = {
  confirmarCadastro: async (req, res) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).send('Token de confirmação ausente.');
      }

      // Verifica e decodifica o token JWT
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(400).send('Token inválido ou expirado.');
      }

      const { nome, email, telefone, senha } = decoded;

      if (!nome || !email || !telefone || !senha) {
        return res.status(400).send('Dados inválidos no token.');
      }

      // Verifica se o usuário já existe
      const usuarioExistente = await usuariosController.findUserByEmail(email);
      if (usuarioExistente) {
        return res.status(400).send('Usuário já confirmado anteriormente.');
      }

      // Cria o usuário
      await usuariosController.createUserDireto({ nome, email, telefone, senha });

      // Redireciona com mensagem de sucesso
      return res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/?cadastro=sucesso');
    } catch (error) {
      console.error('Erro ao confirmar cadastro:', error);
      return res.status(500).send('Erro interno ao confirmar cadastro.');
    }
  },
};

export default confirmacaoController;
