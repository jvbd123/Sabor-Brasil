const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const multer = require('multer');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '36321028',
    database: 'banco_trabalho'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

app.get('/', (req, res) => {
    res.send('Servidor funcionando corretamente! Acesse outras rotas para interagir com o sistema.');
});

// Login
app.post('/login', (req, res) => {
    const { nickname, senha } = req.body;

    if (!nickname || !senha) {
        return res.status(400).json({ success: false, message: 'Nickname e senha são obrigatórios.' });
    }

    const query = 'SELECT id, nickname, foto FROM usuario WHERE nickname = ? AND senha = ?';
    connection.query(query, [nickname, senha], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }

        if (results.length > 0) {
            res.json({ success: true, message: 'Login realizado com sucesso.', usuarioId: results[0].id, foto: results[0].foto });
        } else {
            res.status(401).json({ success: false, message: 'Usuário ou senha incorretos.' });
        }
    });
});

// Cadastro
app.post('/cadastro', (req, res) => {
    const { nome, email, nickname, senha } = req.body;

    if (!nome || !email || !nickname || !senha) {
        console.log('Campos obrigatórios ausentes:', { nome, email, nickname, senha });
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    const checkQuery = 'SELECT * FROM usuario WHERE email = ? OR nickname = ?';
    connection.query(checkQuery, [email, nickname], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }

        if (results.length > 0) {
            console.log('E-mail ou nickname já cadastrados:', { email, nickname });
            return res.status(400).json({ success: false, message: 'E-mail ou Nickname já cadastrados.' });
        }

        const insertQuery = 'INSERT INTO usuario (nome, email, nickname, senha) VALUES (?, ?, ?, ?)';
        connection.query(insertQuery, [nome, email, nickname, senha], (err, results) => {
            if (err) {
                console.error('Erro ao inserir usuário no banco de dados:', err);
                return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.' });
            }

            console.log('Usuário cadastrado com sucesso:', { nome, email, nickname });
            res.status(201).json({ 
                success: true, 
                message: 'Usuário cadastrado com sucesso!', 
                usuarioId: results.insertId 
            });
        });
    });
});

// Configuração do multer para upload de fotos
const upload = multer({ dest: 'public/uploads/' });

// Alterar perfil
app.post('/api/alterar_perfil', upload.single('novaFoto'), (req, res) => {
    const { nicknameAtual, novoNickname } = req.body;
    const novaFoto = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nicknameAtual) {
        return res.status(400).json({ message: 'Nickname atual é obrigatório.' });
    }

    let query = 'UPDATE usuario SET ';
    const values = [];
    const updates = [];

    if (novoNickname) {
        updates.push('nickname = ?');
        values.push(novoNickname);
    }
    if (novaFoto) {
        updates.push('foto = ?');
        values.push(novaFoto);
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: 'Nenhuma alteração fornecida.' });
    }

    query += updates.join(', ') + ' WHERE nickname = ?';
    values.push(nicknameAtual);

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Erro ao atualizar perfil:', err);
            return res.status(500).json({ message: 'Erro ao salvar alterações no banco.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Perfil alterado com sucesso!' });
    });
});

// Buscar perfil
app.get('/api/perfil/:nickname', (req, res) => {
    const { nickname } = req.params;
    const query = 'SELECT foto FROM usuario WHERE nickname = ?';
    connection.query(query, [nickname], (err, results) => {
        if (err) {
            console.error('Erro ao buscar perfil:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar perfil.' });
        }
        if (results.length > 0) {
            res.json({ success: true, foto: results[0].foto });
        } else {
            res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }
    });
});

// Registrar interação (like/deslike)
app.post('/interacao', (req, res) => {
    const { usuarioId, publicacaoId, tipo_interacao } = req.body;

    if (!usuarioId || !publicacaoId) {
        return res.status(400).json({ success: false, message: 'Usuário e publicação são obrigatórios.' });
    }

    if (!['like', 'deslike', 'none'].includes(tipo_interacao)) {
        return res.status(400).json({ success: false, message: 'Tipo de interação inválido.' });
    }

    const upsertQuery = `
        INSERT INTO curtida (usuarioid, publicacaoid, tipo_interacao) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE tipo_interacao = ?
    `;
    connection.query(upsertQuery, [usuarioId, publicacaoId, tipo_interacao, tipo_interacao], (err) => {
        if (err) {
            console.error('Erro ao atualizar interação:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar interação.' });
        }

        const countQuery = `
            SELECT 
                SUM(CASE WHEN tipo_interacao = 'like' THEN 1 ELSE 0 END) as likes,
                SUM(CASE WHEN tipo_interacao = 'deslike' THEN 1 ELSE 0 END) as deslikes
            FROM curtida 
            WHERE publicacaoid = ? AND tipo_interacao IN ('like', 'deslike')
        `;
        connection.query(countQuery, [publicacaoId], (err, countResults) => {
            if (err) {
                console.error('Erro ao contar curtidas:', err);
                return res.status(500).json({ success: false, message: 'Erro ao contar curtidas.' });
            }

            const curtidas = {
                likes: countResults[0].likes || 0,
                deslikes: countResults[0].deslikes || 0
            };

            const userQuery = `
                SELECT 
                    SUM(CASE WHEN tipo_interacao = 'like' THEN 1 ELSE 0 END) as usuarioLikes,
                    SUM(CASE WHEN tipo_interacao = 'deslike' THEN 1 ELSE 0 END) as usuarioDislikes
                FROM curtida 
                WHERE usuarioid = ? AND tipo_interacao IN ('like', 'deslike')
            `;
            connection.query(userQuery, [usuarioId], (err, userResults) => {
                if (err) {
                    console.error('Erro ao contar interações do usuário:', err);
                    return res.status(500).json({ success: false, message: 'Erro ao contar interações do usuário.' });
                }

                res.json({
                    success: true,
                    message: 'Interação registrada com sucesso!',
                    curtidas,
                    usuarioLikes: userResults[0].usuarioLikes || 0,
                    usuarioDislikes: userResults[0].usuarioDislikes || 0
                });
            });
        });
    });
});

// Adicionar comentário
app.post('/comentario', (req, res) => {
    const { usuarioid, publicacaoid, comentario } = req.body;

    if (!usuarioid || !publicacaoid || !comentario) {
        return res.status(400).json({ success: false, message: 'Usuário, publicação e comentário são obrigatórios.' });
    }

    const query = 'INSERT INTO comentario (usuarioid, publicacaoid, texto) VALUES (?, ?, ?)';
    connection.query(query, [usuarioid, publicacaoid, comentario], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar comentário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao adicionar comentário.' });
        }
        res.json({ success: true, message: 'Comentário adicionado!', comentarioId: results.insertId });
    });
});

// Buscar curtidas
app.get('/api/curtidas', (req, res) => {
    const query = `
        SELECT publicacaoid, tipo_interacao, COUNT(*) as count
        FROM curtida
        WHERE tipo_interacao IN ('like', 'deslike')
        GROUP BY publicacaoid, tipo_interacao
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar curtidas:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar curtidas.' });
        }

        const curtidas = {};
        results.forEach(row => {
            if (!curtidas[row.publicacaoid]) curtidas[row.publicacaoid] = { likes: 0, deslikes: 0 };
            if (row.tipo_interacao === 'like') curtidas[row.publicacaoid].likes = row.count;
            if (row.tipo_interacao === 'deslike') curtidas[row.publicacaoid].deslikes = row.count;
        });
        res.json({ success: true, curtidas });
    });
});

// Buscar comentários
app.get('/api/comentarios', (req, res) => {
    const query = `
        SELECT c.id, c.publicacaoid, c.texto, u.nickname, c.usuarioid
        FROM comentario c
        JOIN usuario u ON c.usuarioid = u.id
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar comentários:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar comentários.' });
        }

        const comentarios = {};
        results.forEach(row => {
            if (!comentarios[row.publicacaoid]) comentarios[row.publicacaoid] = [];
            comentarios[row.publicacaoid].push({ id: row.id, usuario: row.nickname, texto: row.texto, usuarioid: row.usuarioid });
        });
        res.json({ success: true, comentarios });
    });
});

// Buscar curtidas do usuário
app.get('/api/curtidas/usuario/:usuarioId', (req, res) => {
    const { usuarioId } = req.params;
    const query = `
        SELECT publicacaoid, tipo_interacao
        FROM curtida
        WHERE usuarioid = ? AND tipo_interacao IN ('like', 'deslike')
    `;
    connection.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar curtidas do usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar curtidas.' });
        }

        let likes = 0;
        let deslikes = 0;
        const interacoes = {};
        results.forEach(row => {
            interacoes[row.publicacaoid] = row.tipo_interacao;
            if (row.tipo_interacao === 'like') likes++;
            if (row.tipo_interacao === 'deslike') deslikes++;
        });
        res.json({ success: true, likes, deslikes, interacoes });
    });
});

// Deletar comentário
app.delete('/api/comentario/:id', (req, res) => {
    const { id } = req.params;
    const usuarioId = req.body.usuarioId;

    if (!usuarioId) {
        return res.status(400).json({ success: false, message: 'Usuário não autenticado.' });
    }

    const query = 'DELETE FROM comentario WHERE id = ? AND usuarioid = ?';
    connection.query(query, [id, usuarioId], (err, results) => {
        if (err) {
            console.error('Erro ao deletar comentário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao deletar comentário.' });
        }

        if (results.affectedRows === 0) {
            return res.status(403).json({ success: false, message: 'Você não tem permissão para deletar este comentário ou ele não existe.' });
        }

        res.json({ success: true, message: 'Comentário deletado com sucesso!' });
    });
});

// Editar comentário
app.put('/api/comentario/:id', (req, res) => {
    const { id } = req.params;
    const { usuarioId, texto } = req.body;

    if (!usuarioId || !texto) {
        return res.status(400).json({ success: false, message: 'Usuário e texto são obrigatórios.' });
    }

    const query = 'UPDATE comentario SET texto = ? WHERE id = ? AND usuarioid = ?';
    connection.query(query, [texto, id, usuarioId], (err, results) => {
        if (err) {
            console.error('Erro ao editar comentário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao editar comentário.' });
        }

        if (results.affectedRows === 0) {
            return res.status(403).json({ success: false, message: 'Você não tem permissão para editar este comentário ou ele não existe.' });
        }

        res.json({ success: true, message: 'Comentário editado com sucesso!' });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
    const startBrowserCommand = process.platform === 'win32' ? 'start http://localhost:3000' : 'open http://localhost:3000';
    exec(startBrowserCommand, (err, stdout, stderr) => {
        if (err) {
            console.error(`Erro ao abrir o navegador: ${stderr}`);
            return;
        }
        console.log(`Navegador aberto com sucesso: ${stdout}`);
    });
});