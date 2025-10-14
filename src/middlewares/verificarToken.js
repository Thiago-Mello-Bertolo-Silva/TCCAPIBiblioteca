import jwt from 'jsonwebtoken';

function checaToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Adiciona o payload do token ao request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

export default checaToken;
