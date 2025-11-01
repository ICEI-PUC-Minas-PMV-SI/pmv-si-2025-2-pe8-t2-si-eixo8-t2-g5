const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'minha_chave_super_secreta';

exports.autenticar = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1 OR nome = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    const user = result.rows[0];
    const senhaCorreta = await bcrypt.compare(password, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: user.id, username: user.nome }, SECRET_KEY, { expiresIn: '8h' });

    return res.status(200).json({
      message: 'Autenticado com sucesso!',
      token,
      user: { 
        id: user.id, 
        username: user.nome,
        email: user.email 
      }
    });

  } catch (err) {
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};