import { Router } from 'express';

const router = Router();

import confirmacaoController from '../controllers/confirmacaoController.js';
import { enviarEmailCadastro } from '../controllers/emailController.js';
import enviarEmailRecuperacao from '../controllers/enviarEmailRecuperacao.js';
import authService from '../services/authService.js';
import dashboardMetricsController from '../controllers/metricsController.js';
import { livrosPorMes } from '../controllers/dashboardController.js';
import usuariosController from '../controllers/usuariosController.js';
import livrosController from '../controllers/livrosController.js';
import emprestimosController from '../controllers/emprestimosController.js'; 


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
router.put('/emprestimo/:id', emprestimosController.updateEmprestimo);
router.delete('/emprestimo/:id', emprestimosController.deleteEmprestimo);

// Tabela de dados
router.get('/dashboard-metrics', dashboardMetricsController.getDashboardMetrics);
router.get('/infracoes-chart-data', dashboardMetricsController.getInfracoesChartData);

router.get('/livros-por-mes', livrosPorMes);

export default router;
