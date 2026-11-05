const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Array mutável em memória simulando o banco de dados
let produtos = [
  { id: 1, nome: 'Smartphone Android', preco: 1500.00, categoria: 'Eletrônicos' },
  { id: 2, nome: 'Fone de Ouvido Bluetooth', preco: 250.00, categoria: 'Acessórios' },
  { id: 3, nome: 'Carregador Rápido USB-C', preco: 120.00, categoria: 'Acessórios' }
];

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/produtos', (_req, res) => res.status(200).json(produtos));

// Rota POST /produtos (Criar)
app.post('/produtos', (req, res) => {
  const { nome, preco, categoria } = req.body;
  if (!nome || !preco) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios!' });
  }
  const novo = { id: Date.now(), nome, preco: Number(preco), categoria: categoria || 'Geral' };
  produtos.push(novo);
  res.status(201).json(novo);
});

// Rota DELETE /produtos/:id (Remover)
app.delete('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produtoExiste = produtos.some(p => p.id === id);
  if (!produtoExiste) {
    return res.status(404).json({ erro: 'Produto não encontrado!' });
  }
  produtos = produtos.filter(p => p.id !== id);
  res.status(200).json({ mensagem: 'Produto removido com sucesso!' });
});

// Biblioteca que cria e verifica tokens JWT no servidor.
const jwt = require('jsonwebtoken');

// Esta chave assina o token: somente o servidor deve conhecê-la.
// Em um projeto real, guarde-a em uma variável de ambiente, nunca no código versionado.
const CHAVE_SECRETA = 'minha_chave_secreta_faculdade_2026';

// POST recebe dados no corpo da requisição; neste caso, e-mail e senha do formulário.
app.post('/login', (req, res) => {
  // Desestruturação: extrai as propriedades enviadas em req.body.
  const { email, senha } = req.body;

  // Credenciais fixas apenas para a demonstração. Em produção, consulte o banco de dados
  // e compare a senha usando hash (por exemplo, bcrypt).
  if (email === 'aluno@faculdade.edu.br' && senha === '123456') {
    // O payload contém dados de identificação. Nunca coloque a senha dentro do token.
    const token = jwt.sign(
      // sub (subject) identifica o usuário dono deste token.
      { sub: 1, email: email, nome: 'Aluno Exemplo' },
      CHAVE_SECRETA,
      // Após duas horas, o token expira e uma nova autenticação será necessária.
      { expiresIn: '2h' }
    );

    // 200 significa que o login foi processado com sucesso.
    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token: token,
      usuario: { id: 1, nome: 'Aluno Exemplo', email: email }
    });
  }

  // 401 informa que o cliente não apresentou credenciais válidas.
  return res.status(401).json({ erro: 'Credenciais inválidas!' });
});

// Middleware de verificação de token JWT
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai a string do "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado: Token não fornecido!' });
  }

  jwt.verify(token, CHAVE_SECRETA, (err, usuario) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado!' });
    }
    req.usuario = usuario;
    next();
  });
}

// Endpoint protegido da API
app.get('/perfil-protegido', autenticarToken, (req, res) => {
  res.status(200).json({ mensagem: 'Dados confidenciais acessados!', usuario: req.usuario });
});

module.exports = app;