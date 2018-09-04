// Importando módulo para trabalhar com requisições
var	http = require('http');
// Importando uma instância do express do arquivo
var app = require('./config/express')();
//Criando um servidor usando a instância do express(app) e e colocando o mesmo para escutar na porta configurada no express.js
http.createServer(app).listen(app.get('port'), function(){
	//Exibindo uma mensagem com o número da porta do servidor
	console.log('Servidor do EasyPay escutando na porta '+app.get('port'));
});