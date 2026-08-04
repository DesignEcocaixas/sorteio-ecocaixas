const express = require('express');
const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');

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
    user: 'sorteio',
    password: '23!Bestdavidx',
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

// ROTA PARA EXPORTAR PLANILHA EXCEL
app.get('/admin/exportar', async (req, res) => {
    try {
        const [leads] = await db.execute('SELECT * FROM leads ORDER BY data_cadastro DESC');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Participantes');

        // Define as colunas
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Nome da Pizzaria', key: 'nome', width: 35 },
            { header: 'Telefone', key: 'telefone', width: 25 },
            { header: 'Instagram', key: 'instagram', width: 30 },
            { header: 'Data de Cadastro', key: 'data_cadastro', width: 25 }
        ];

        // Formatação visual do cabeçalho (Fundo verde, texto branco)
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Adiciona as linhas
        leads.forEach(lead => {
            worksheet.addRow({
                id: lead.id,
                nome: lead.nome,
                telefone: lead.telefone,
                instagram: '@' + lead.instagram,
                data_cadastro: lead.data_cadastro ? new Date(lead.data_cadastro).toLocaleString('pt-BR') : ''
            });
        });

        // Configura o cabeçalho da resposta para baixar o arquivo
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=participantes_ecocaixas.xlsx');

        // Envia o arquivo
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Erro ao gerar Excel:', error);
        res.redirect('/admin?erro=Erro ao gerar o arquivo Excel.');
    }
});

app.listen(3061, () => console.log('Servidor SSR rodando na porta 3061'));