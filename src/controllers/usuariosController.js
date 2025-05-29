import Usuario from '../models/Usuario.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Função de envio de e-mail para redefinição de senha
async function esqueciSenha(req, res) {
    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ message: 'E-mail não encontrado.' });
        }

        const token = jwt.sign({ email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });

        const resetLink = `${FRONTEND_URL}/nova-senha/${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: usuario.email,
            subject: 'Redefinição de Senha',
            html: `<p>Olá, ${usuario.nome}!</p>
                   <p>Clique no botão abaixo para redefinir sua senha:</p>
                   <p><a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Redefinir Senha</a></p>
                   <p>Se você não solicitou isso, ignore este e-mail.</p>`,
        });

        res.json({ message: 'E-mail de redefinição de senha enviado.' });
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        res.status(500).json({ message: 'Erro ao enviar e-mail de redefinição.' });
    }
}

// Atualizada para buscar o usuário pelo e-mail do token
async function novaSenhaComToken(req, res) {
    const { token } = req.params;
    const { novaSenha } = req.body;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const usuario = await Usuario.findOne({ where: { email: decoded.email } });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        usuario.senha = novaSenha;
        await usuario.save();

        return res.json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(400).json({ message: 'Token inválido ou expirado.' });
    }
}

// Demais funções inalteradas
async function createUserDireto({ nome, email, telefone, senha, cargo = 'usuario' }) {
    try {
        const user = await Usuario.create({ nome, email, telefone, senha, cargo });
        return user;
    } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        throw new Error("Erro ao criar usuário: " + error.message);
    }
}

async function createUser(req, res) {
    const { nome, email, telefone, senha, cargo } = req.body;

    if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    try {
        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "E-mail já cadastrado. Tente outro." });
        }

        const user = await Usuario.create({
            nome,
            email,
            telefone,
            senha,
            cargo: cargo || 'usuario',
        });

        res.status(201).json(user);
    } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        res.status(500).json({ error: "Erro ao criar usuário: " + error.message });
    }
}

async function findUserByEmail(email) {
    try {
        return await Usuario.findOne({ where: { email } });
    } catch (error) {
        console.error("Erro ao buscar usuário por e-mail:", error);
        return null;
    }
}

async function getUsers(req, res) {
    try {
        const users = await Usuario.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários: ' + error.message });
    }
}

async function getUserById(req, res) {
    const { id } = req.params;

    try {
        const user = await Usuario.findByPk(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário: ' + error.message });
    }
}

async function updateUser(req, res) {
    const { id } = req.params;
    const { nome, email, telefone, senha, cargo } = req.body; 

    try {
        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (nome) user.nome = nome;
        if (email) user.email = email;
        if (telefone) user.telefone = telefone;
        if (senha) user.senha = senha;
        if (cargo) user.cargo = cargo;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário: ' + error.message });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await user.destroy();
        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir usuário: ' + error.message });
    }
}

async function redefinirSenha(req, res) {
    const { token } = req.params;
    const { novaSenha } = req.body;
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
  
      const usuario = await Usuario.findByPk(decoded.id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      const hash = await bcrypt.hash(novaSenha, 10);
      usuario.senha = hash;
      await usuario.save();
  
      return res.json({ message: 'Senha atualizada com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }
  }

// Exportações
export default {
    createUser,
    createUserDireto,
    findUserByEmail,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    novaSenhaComToken,
    esqueciSenha,
    redefinirSenha, 
};
