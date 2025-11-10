const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'minha_chave_super_secreta';


exports.autenticar = async (req, res) => {
  const { username, password } = req.body;

  console.log('Tentativa de login recebida:', { username }); 

  try {
   
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1 OR nome = $1', [username]);

    console.log('Usuários encontrados:', result.rows.length); 

    if (result.rows.length === 0) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    const user = result.rows[0];
    console.log('Usuário encontrado:', { id: user.id, nome: user.nome, email: user.email }); // Log para debug

    
    const senhaCorreta = await bcrypt.compare(password, user.senha);
    console.log('Resultado da comparação de senha:', senhaCorreta);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

   
    const token = jwt.sign({ id: user.id, username: user.nome }, SECRET_KEY, { expiresIn: '8h' });

    console.log('Token gerado com sucesso para:', user.nome); 

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
    console.error('Erro na autenticação:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};



exports.criarUsuario = async (req, res) => {
  const { nome, email, password, tipo } = req.body;

 
  if (!nome || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
   
    const checkUser = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    }

  
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(password, salt);

   
    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo) 
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, tipo; 
    `;
    const values = [nome, email, senhaHash, tipo || 'cliente'];
    
    const result = await db.query(query, values);
    const newUser = result.rows[0];

    console.log('Novo usuário criado:', newUser.email);

  
    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: newUser
    });

  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    return res.status(500).json({ message: 'Erro interno no servidor ao registrar usuário.' });
  }
};