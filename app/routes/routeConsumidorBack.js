module.exports = function (app) {
    //Cria a variável controller que retorna uma instância da controller
    var controller = app.controllers.controllerConsumidorBack;
    //Cria duas rotas ligadas as seus respectivos controllers
    app.post('/cadastroConsumidor', controller.cadastro);
    app.get('/buscarPerfilConsumidor', controller.buscarPerfil);
    app.post('/editarPerfilConsumidor', controller.editarPerfil);
    app.get('/sairConsumidor', controller.sair);
    app.post('/buscarProduto', controller.buscarProduto);
    app.post('/favoritarProduto', controller.favoritarProduto);
    app.get('/buscarFavoritos', controller.buscarFavoritos);
    app.post('/excluirFavorito', controller.excluirFavorito);
    app.post('/buscarEstabelecimento', controller.buscarEstabelecimento);
    app.post('/registrarPosicao', controller.registrarPosicao);
}