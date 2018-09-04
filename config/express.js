// Instância do body-parser que conserta alguns problemas do DELETE e PUT em alguns navegadores
var bodyParser = require('body-parser');
// Instanciando o módulo express
var express = require('express');
// Instanciando o módulo express-load
var load = require('express-load');


module.exports = function () {
    // Criando uma variável para receber a instância do express
    var app = express();
    // Setando o valor da porta do servidor
    app.set('port', 3000);
    // Salva os dados do usuario
    app.usuario = {};
    app.use(express.static('./public'));
    // As requisições vão ser com o corpo urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    // O body será convertido em json
    app.use(bodyParser.json());
    // Middleware responsável por resolver o problema com DELETE e PUT de alguns navegadores
    app.use(require('method-override')());
    //Carregando os scripts das seguintes pastas: controller e routes
    // cwd é o comando que muda a pasta raiz para "app" e procura os scripts nela
    load('models', { cwd: 'app' })
        .then('controllers')
        .then('routes')
        .into(app);
    // Setando a view engine e o tipo de arquivo da mesma
    app.set('view engine', 'ejs');
    // Setando a pasta onde estarão as views
    app.set('views', './app/views');

    return app;
}