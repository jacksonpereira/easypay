angular.module('routeControllerConsumidorFront').controller('ControllerConsumidor', function ($scope, $http, $window) {

    $scope.produtos = [];
    $window.onload = function () {
        if ($window.navigator && $window.navigator.geolocation) {
            var geolocation = $window.navigator.geolocation;
            geolocation.getCurrentPosition(sucesso, erro);
        } else {
            $window.alert('Geolocalização não suportada em seu navegador.\nAtualize seu navegador ou use outro.');
        }
        function sucesso(posicao) {
            posicao.coords.latitude;
            posicao.coords.longitude;
            console.log(posicao.coords.latitude);
            console.log(posicao.coords.longitude);
            var aux = {};
            aux.latitude = posicao.coords.latitude;
            aux.longitude = posicao.coords.longitude;
            console.log(aux);
            return $http.post('/registrarPosicao', aux)
                .catch(function (error) {
                    $window.alert("Ocorreu um erro ao buscar sua localização.\nNão será possível usar essa função do sistema!");
                });
        }
        function erro(error) {
            $window.alert('Erro au buscar a localização do usuário.\nTente novamente mais tarde.');
        }
    };


    $scope.cadastro = function (consumidor) {
        $http.post('/cadastroConsumidor', consumidor)
            .then(function (response) {
                $window.alert('Cadastrado!');
                $window.location.reload();
            })
            .catch(function (error) {
                $window.alert('Erro ao cadastrar consumidor.\nTente novamente mais tarde.');
            });
    };

    $scope.buscarProduto = function (pesquisa) {
        /* pesquisa.latitude = $scope.latitude;
        pesquisa.longitude = $scope.longitude; */
        return $http.post('/buscarProduto', pesquisa)
            .then(function (response) {
                $scope.produtos = response.data;
                $window.console.log($scope.produtos);
                if ($scope.produtos.length == 0) {
                    $window.alert('Nenhum produto encontrado!');
                }
            })
            .catch(function (error) {
                $window.alert('Nenhum produto encontrado!');
            });
    };

    $scope.favoritarProduto = function (produto) {
        $http.post('/favoritarProduto', produto)
            .then(function (response) {
                $window.alert('Produto favoritado');
            })
            .catch(function (error) {
                $window.alert('Falha ao favoritar produto.\nTente novamente mais tarde.');
            });
    }

    $scope.buscarEstabelecimento = function (estabelecimento) {
        $http.post('/buscarEstabelecimento', { chave: estabelecimento })
            .then(function (response) {
                $window.console.log(response);
                $window.alert("Nome do estabelecimento:\n" + response.data.nome_fantasia + "\n\nEndereço:\n" + response.data.logradouro + ", " + response.data.numero + " " + response.data.complemento + " " + response.data.bairro + " " + response.data.cidade + "-" + response.data.estado + "\n\nTelefone: " + response.data.telefone);
            });
    };

    //Função que desloga consumidor
    $scope.sair = function () {
        var r = confirm("Deseja deslogar do sistema?");
        if (r == true) {
            $http.get('/sairConsumidor')
                .then(function () {
                    $window.location.href = '/index.html';
                })
                .catch(function () {
                    $window.alert("Ocorreu um erro ao deslogar do sistema.\nTente novamente mais tarde.");
                });
        }
    }
});