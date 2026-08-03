const express = require('express');
const mysql = require('mysql2/promise');

// Importando as nossas views SSR
const clientView = require('./clientView');
const adminView = require('./adminView');

const app = express();

// Middleware para processar dados JSON enviados pelo front-end (fetch)
app.use(express.json());

// Middleware para processar dados de formulários tradicionais do Admin
app.use(express.urlencoded({ extended: true }));

// Libera a pasta "public" para carregar imagens e arquivos estáticos
app.use(express.static('public'));

// Configuração do Banco de Dados
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ecocaixas_sorteio'
});

// ==========================================
// ROTAS DO CLIENTE
// ==========================================
app.get('/', (req, res) => {
    // Pegamos mensagens vindas por query string para eventuais redirecionamentos antigos
    const { msg, erro } = req.query;
    res.send(clientView(msg, erro));
});

app.post('/cadastrar', async (req, res) => {
    const { nome, telefone, instagram } = req.body;
    
    try {
        await db.execute(
            'INSERT INTO leads (nome, telefone, instagram) VALUES (?, ?, ?)',
            [nome, telefone, instagram.replace('@', '')]
        );
        // Retorna um JSON de SUCESSO para o front-end abrir o Modal
        res.status(201).json({ message: 'Cadastro realizado com sucesso! Boa sorte!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            // Retorna um JSON de ERRO para o front-end abrir o Modal
            res.status(400).json({ error: 'Este perfil do Instagram já está participando!' });
        } else {
            res.status(500).json({ error: 'Erro interno no servidor. Tente novamente.' });
        }
    }
});

// ==========================================
// ROTAS DO ADMIN
// ==========================================
app.get('/admin', async (req, res) => {
    try {
        // Busca todos os leads
        const [leads] = await db.execute('SELECT * FROM leads ORDER BY data_cadastro DESC');
        
        // Verifica se há um ganhador na query string (após o sorteio)
        let ganhador = null;
        if (req.query.ganhadorId) {
            const [rows] = await db.execute('SELECT * FROM leads WHERE id = ?', [req.query.ganhadorId]);
            if (rows.length > 0) ganhador = rows[0];
        }

        res.send(adminView(leads, ganhador, req.query.erro, req.query.msg));
    } catch (error) {
        res.send('Erro ao carregar o painel administrativo.');
    }
});

app.post('/admin/sortear', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id FROM leads ORDER BY RAND() LIMIT 1');
        
        if (rows.length === 0) {
            return res.redirect('/admin?erro=Nenhum participante cadastrado para sortear.');
        }
        
        // Redireciona para o admin passando o ID do ganhador
        res.redirect(`/admin?ganhadorId=${rows[0].id}`);
    } catch (error) {
        res.redirect('/admin?erro=Erro ao realizar o sorteio.');
    }
});

// ROTA PARA EXCLUIR UM LEAD
app.post('/admin/excluir', async (req, res) => {
    const { id } = req.body;
    
    try {
        await db.execute('DELETE FROM leads WHERE id = ?', [id]);
        res.redirect('/admin?msg=Pizzaria excluída com sucesso!');
    } catch (error) {
        res.redirect('/admin?erro=Erro ao excluir a pizzaria.');
    }
});

app.listen(3061, () => console.log('Servidor SSR rodando na porta 3061'));