module.exports = function (app) {
    //Cria a variável controller que retorna uma instância da controller contato
    var controller = app.controllers.controllerLoginBack;
    //Cria duas rotas ligadas as seus respectivos controllers
    app.post('/', controller.login);
    app.post('/lembrarSenha', controller.lembrarSenha);
}