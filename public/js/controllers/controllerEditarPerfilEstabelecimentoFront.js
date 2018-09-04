angular.module('routeControllerEditarPerfilEstabelecimento').controller('ControllerEditarPerfilEstabelecimento', function ($scope, $http, $window) {

    $scope.estabelecimento = "";
    //Busca o perfil do estabelecimento
    $window.onload = function () {
        $http.get('/buscarPerfilEstabelecimento')
            .then(function (response) {
                $scope.estabelecimento = response.data;
                $window.console.log($scope.estabelecimento);
            });
    }

    //Função que edita o perfil do estabelecimento
    $scope.editarPerfil = function (estabelecimento) {
        var r = confirm("Deseja realmente editar o perfil?");
        if (r == true) {
            var enderecoApi = estabelecimento.logradouro + ', ' + estabelecimento.numero + ' ' + estabelecimento.complemento
                + ' ' + estabelecimento.bairro + ' ' + estabelecimento.cidade + ' ' + estabelecimento.estado;
            return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + enderecoApi + '&key=AIzaSyCyYNsyuNzNJEQvllxT_onDTv0nAadz5-c')
                .then(function (response) {
                    estabelecimento.lat = response.data.results[0].geometry.location.lat;
                    estabelecimento.lng = response.data.results[0].geometry.location.lng;
                    return $http.post('/editarPerfilEstabelecimento', estabelecimento)
                        .then(function (responseb) {
                            $window.console.log(responseb);
                            $window.alert('Dados alterados com sucesso!');
                            return;
                        })
                        .catch(function (error) {
                            $window.console.log(error);
                            $window.alert('Erro ao editar estabelecimento.\nTente novamente mais tarde.');
                        });
                })
                .catch(function (error) {
                    $window.console.log(error);
                    $window.alert('Erro ao buscar localização do estabelecimento.\nTente novamente mais tarde.');
                });
        }
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