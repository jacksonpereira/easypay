angular.module('routeControllerEstabelecimentoFront').controller('ControllerEstabelecimento', function ($scope, $http, $window) {

    //Lista com os produtos cadastrados no sistema
    $scope.listaProdutosSistema = "";
    $scope.listaMeusProdutos = "";
    //Lista com os produtos do estabelecimento
    $window.onload = function () {
        return $http.get('/listaMeusProdutos')
            .then(function (response) {
                $scope.listaMeusProdutos = response.data;
                $window.console.log(response);
            })
            .catch(function (error) {
                $window.console.log(error);
                $window.alert("Erro ao buscar os produtos no sistema.\nTente novamente mais tarde.");
            });
    }

    $scope.cadastro = function (estabelecimento) {
        // Busca a latitude e longitude do endereço fornecido
        var enderecoApi = estabelecimento.logradouro + ', ' + estabelecimento.numero + ' ' + estabelecimento.complemento
            + ' ' + estabelecimento.bairro + ' ' + estabelecimento.cidade + ' ' + estabelecimento.estado;
        return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + enderecoApi + '&key=AIzaSyCyYNsyuNzNJEQvllxT_onDTv0nAadz5-c')
            .then(function (response) {
                estabelecimento.lat = response.data.results[0].geometry.location.lat;
                estabelecimento.lng = response.data.results[0].geometry.location.lng;
                return $http.post('/cadastroEstabelecimento', estabelecimento)
                    .then(function (responseB) {
                        $window.alert('Cadastrado!');
                        $window.location.reload();
                        return;
                    })
                    .catch(function (error) {
                        if (error.status != 200) {
                            $window.console.log(error);
                            $window.alert('Erro ao cadastrar consumidor.\nTente novamente mais tarde.');
                        }
                        return;
                    });
            })
            .catch(function (error) {
                $window.console.log(error);
                $window.alert('Erro ao cadastrar consumidor.\nTente novamente mais tarde.');
                return;
            });
        // ********************************************   ESTUDAR CHANNING PROMMISE   ******************************************** 
    };

    //Função de busca de produtos cadastrados no sistema
    $scope.produtosSistema = function (nomeProduto) {
        myObj = { nome: nomeProduto };
        return $http.post('/produtosSistema', myObj)
            .then(function (response) {
                $scope.listaProdutosSistema = response.data;
            })
            .catch(function (error) {
                $window.console.log(error);
            });
    };

    //Função de cadatro de um produto
    $scope.cadastrarProduto = function (produto) {
        produto.valor = parseFloat($window.prompt("Digite o valor do produto:")).toFixed(2);
        return $http.post('/cadastrarProduto', produto)
            .then(function (response) {
                $window.alert("Produto cadastrado com sucesso!");
            })
            .catch(function (error) {
                $window.console.log(error);
            });
    };

    //Função que deleta um produto do estabelecimento
    $scope.excluirProduto = function (produto) {
        $window.console.log("Produto no front: " + produto);
        var r = confirm("Deseja realmente excluir este produto?");
        if (r == true) {
            return $http.post('/excluirProduto', produto)
                .then(function (response) {
                    $window.alert("Produto excluído!");
                    $window.location.reload();
                })
                .catch(function () {
                    $window.alert("Impossível excluir o produto.\nTente novamente mais tarde.");
                });
        }
    };

    //Função que altera o valor do produto
    $scope.alterarValor = function (idProduto) {
        var valorNovo = parseFloat($window.prompt("Digite o valor do produto:")).toFixed(2);
        $http.post('/alterarValor', { chave: idProduto, valor: valorNovo })
            .then(function (response) {
                $window.console.log(response);
                $window.alert('Valor alterado!');
                $window.location.reload();
                return;
            })
            .catch(function (error) {
                $window.console.log(error);
                $window.alert('Erro ao alterar o valor do produto.\nTente novamente mais tarde.');
            });
    };

    //Função que desloga estabelecimento
    $scope.sair = function () {
        var r = confirm("Deseja deslogar do sistema?");
        if (r == true) {
            $http.get('/sairEstabelecimento')
                .then(function () {
                    $window.location.href = '/index.html';
                })
                .catch(function () {
                    $window.alert("Ocorreu um erro ao deslogar do sistema.\nTente novamente mais tarde.");
                });
        }
    }

});