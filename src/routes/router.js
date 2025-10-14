import { Router } from 'express';

const router = Router();

import confirmacaoController from '../controllers/confirmacaoController.js';
import { enviarEmailCadastro } from '../controllers/emailController.js';
import enviarEmailRecuperacao from '../controllers/enviarEmailRecuperacao.js';
import authService from '../services/authService.js';
import dashboardMetricsController from '../controllers/metricsController.js';
import { livrosPorEditora, livrosPorAutores } from '../controllers/dashboardController.js';
import usuariosController from '../controllers/usuariosController.js';
import livrosController from '../controllers/livrosController.js';
import emprestimosController from '../controllers/emprestimosController.js'; 
import verificarToken from '../middlewares/verificarToken.js';
import { enviarFeedback } from "../controllers/feedbackController.js";
import { verificarNotificacoes } from "../controllers/notificacaoController.js"


// Envio de e-mail e confirmação
router.post('/enviar-email', enviarEmailCadastro);
router.get('/confirmar/:token', confirmacaoController.confirmarCadastro);

// Troca de senha
router.post('/esqueci-senha', enviarEmailRecuperacao);
router.post('/nova-senha/:token', usuariosController.redefinirSenha);

// Autenticação
router.post('/login', authService.login);
router.post('/eu', authService.pegarUsuarioDoToken);

// Usuários
router.post('/usuario', usuariosController.createUser);
router.get('/usuarios', usuariosController.getUsers);
router.get('/usuario/:id', usuariosController.getUserById);
router.put('/usuario/:id', usuariosController.updateUser);
router.delete('/usuario/:id', usuariosController.deleteUser);

// Livros
router.post('/livro', livrosController.createLivro);
router.get('/livros', livrosController.getLivros);
router.get('/livro/:id', livrosController.getLivroById);
router.put('/livro/:id', livrosController.updateLivro);
router.delete('/livro/:id', livrosController.deleteLivro);

// Empréstimos
router.post('/emprestimo', emprestimosController.createEmprestimo);
router.get('/emprestimos', emprestimosController.getEmprestimos);
router.get('/emprestimo/:id', emprestimosController.getEmprestimoById);
router.get('/meus-emprestimos/ativos', verificarToken, emprestimosController.getEmprestimosAtivosByUsuario);
router.get('/meus-emprestimos/ultimo', verificarToken, emprestimosController.getUltimoEmprestimoByUsuario);
router.put('/emprestimo/:id', emprestimosController.updateEmprestimo);
router.delete('/emprestimo/:id', emprestimosController.deleteEmprestimo);

// Tabela de dados
router.get('/dashboard-metrics', dashboardMetricsController.getDashboardMetrics);
router.get('/meus-emprestimos', verificarToken, emprestimosController.getEmprestimosDoUsuario);
router.get('/livros-por-editora', livrosPorEditora);
router.get('/livros-por-autores', livrosPorAutores);

// Rota da mensagem de feedback
router.post('/enviar-feedback', enviarFeedback)

// Rota de notificação
router.get('/notificacoes/:id', verificarNotificacoes)

export default router;
