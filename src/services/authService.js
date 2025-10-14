import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

async function login(req, res) {
    const { login, password } = req.body;

    let user;
    
    // Tenta agora na tabela Usuario
    user = await Usuario.findOne({ where: { email: login } });

    if (!user || user.senha !== password) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const payload = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo || 'usuario'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ token });
}

function checaToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
}

function pegarUsuarioDoToken(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const usuarioDoToken = jwt.verify(token, process.env.JWT_SECRET);
    res.json(usuarioDoToken);
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

export default {
    login,
    checaToken,
    pegarUsuarioDoToken
};
