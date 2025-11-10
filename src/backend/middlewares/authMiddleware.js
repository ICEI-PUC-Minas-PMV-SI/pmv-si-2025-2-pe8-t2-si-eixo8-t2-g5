const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'minha_chave_super_secreta');
    req.usuario = decoded;
    next();
  } catch (erro) {
    return res.status(403).json({ erro: 'Token inválido.' });
  }
}

module.exports = { autenticarToken };
