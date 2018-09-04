angular.module('routeControllerEditarPerfilConsumidor').controller('ControllerEditarPerfilConsumidor', function ($scope, $http, $window) {

    $scope.consumidor = "";
    //Busca o perfil do estabelecimento
    $window.onload = function () {
        $http.get('/buscarPerfilConsumidor')
            .then(function (response) {
                $scope.consumidor = response.data;
                $window.console.log($scope.consumidor);
            });
    }

    //Função que edita o perfil do estabelecimento
    $scope.editarPerfil = function (consumidor) {
        $http.post('/editarPerfilConsumidor', consumidor)
            .then(function (response) {
                $window.console.log(response);
                $window.alert('Dados alterados!');
                return;
            })
            .catch(function (error) {
                $window.console.log(error);
                $window.alert('Erro ao editar estabelecimento.\nTente novamente mais tarde.');
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