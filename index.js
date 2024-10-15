const express = require('express');
var bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


app.use(methodOverride('_method'));

let itens = [];
let baseId = 0;

app.get('/', (req, res) => {
  res.render('index', { itens: itens });
});

app.get('/tarefas/:id/editar', (req, res) => {
  const id = parseInt(req.params.id);
  res.render('edit', { item: itens[id], id: id });
});

app.get('/tarefas', (req, res) => {
  const statusQuery = req.query.status;

  if (statusQuery === 'true' || statusQuery === 'false') {
    const statusBoolean = statusQuery === 'true'; 
    const filteredItems = itens.filter(item => item.status === statusBoolean);
    return res.json(filteredItems);
  }
  res.json(itens);
});

app.get('/tarefas/novo', function(req, res) {
    res.render('form');
});

app.post('/tarefas', (req, res) => {
  const nome = req.body.nome;
  const status = req.body.status === 'on' ? true : false;

  const nomeDuplicado = itens.some(item => item.nome === nome);
  if (nomeDuplicado) {
    return res.json({ erro: 'Nome já existente, escolha outro nome.' });
  }

  const novoItem = {
    id: baseId,
    nome: nome,
    status: status
  };

  baseId += 1;
  itens.push(novoItem);

  res.redirect('/');
});


app.put('/tarefas/:id', (req, res) => {
  var id = req.params.id;
  var nome = req.body.nome;

  var nomeDuplicado = itens.some((item, index) => {
      return item.nome === nome && index != id;
  });

  if (nomeDuplicado) {
      return res.json({ erro: 'Nome já existente, escolha outro nome.' });
  }
  
  itens[id] = req.body;
  itens[id]['id'] = parseInt(id)
  if (itens[id]['status'] == 'on') { itens[id]['status'] = true }
  else { itens[id]['status'] = false }
  res.redirect('/');
});

app.delete('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = itens.findIndex(item => item.id === id);
  if (index >= 0) {
    itens.splice(index, 1);
    res.redirect('/');
  } else {
    res.json({ message: 'Item não encontrado' });
  }
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000'); // Mensagem que diz que o servidor está no ar
});
