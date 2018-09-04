module.exports = function (app) {
    //Cria a variável controller que retorna uma instância da controller
    var controller = app.controllers.controllerEstabelecimentoBack;
    //Cria duas rotas ligadas as seus respectivos controllers
    app.post('/cadastroEstabelecimento', controller.cadastro);
    app.post('/produtosSistema', controller.produtosSistema);
    app.post('/cadastrarProduto', controller.cadastrarProduto);
    app.get('/listaMeusProdutos', controller.listaMeusProdutos);
    app.post('/excluirProduto', controller.excluirProduto);
    app.post('/editarPerfilEstabelecimento', controller.editarPerfil);
    app.get('/buscarPerfilEstabelecimento', controller.buscarPerfil);
    app.get('/sairEstabelecimento', controller.sair);
    app.post('/alterarValor', controller.alterarValor);
}