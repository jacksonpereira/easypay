angular.module('routeControllerFavoritosConsumidor').controller('ControllerFavoritosConsumidor', function ($scope, $http, $window) {

    $scope.favoritos = {};
    //Busca os favoritos do consumidor
    $window.onload = function () {
        $http.get('/buscarFavoritos')
            .then(function (response) {
                $scope.favoritos = response.data
            });
    };

    $scope.excluirFavorito = function (produto) {
        $http.post('/excluirFavorito', produto)
            .then(function (response) {
                $window.alert("Favorito excluído!");
                $window.location.reload();
            });
    };

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