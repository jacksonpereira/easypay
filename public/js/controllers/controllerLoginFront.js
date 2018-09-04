angular.module('routeLoginFront').controller('ControllerLogin', function ($scope, $http, $window, $location) {
    // Instruções
    $scope.login = function (usuario) {
        // Faz a requisição para cadastrar no banco
        return $http.post('/', usuario)
            .then(function (response) {
                $window.console.log(response);
                if (response.data == 'Consumidor') {
                    $window.console.log(response);
                    $window.location.href = '/menuConsumidor.html';
                } else if (response.data == 'Estabelecimento') {
                    $window.console.log(response);
                    $window.location.href = '/menuEstabelecimento.html';
                }
                return;
            })
            .catch(function (error) {
                if (error.status == 404) {
                    $window.alert('Usuário não encontrado!');
                    $window.console.log(error);
                } else {
                    $window.alert('Erro ao logar!');
                    $window.console.log(error);
                }
                return;
            });
    };

    $scope.lembrarSenha = function (pesquisa) {
        $http.post('/lembrarSenha', { chave: pesquisa })
            .then(function (response) {
                $window.alert("A senha foi enviada para o email: " + response.data);
                console.log(response);
            })
            .catch(function (error) {
                $window.alert("Erro ao lembrar a senha do usuário.");
                console.log(error);
            });
    };
});