var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID;

// Array com objetos contato
module.exports = function (app) {
    //Cria uma variável que armazena um objeto controller
    var controller = {};

    //Função de cadastro de um consumidor no firebase
    controller.cadastro = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao conectar o banco");
                res.status(500).send("Erro ao conectar o banco");
            }
            // Criando o objeto a ser inserido
            var myObj = {
                _id: req.body.cpf,
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha,
                favoritos: []
            }
            dbo.collection("Consumidor").insertOne(myObj, function (err, resp) {
                if (err) {
                    console.log("Erro ao inserir o consumidor no banco");
                    res.status(500).send("Erro ao inserir o consumidor no banco");
                } else {
                    res.status(200).send("Cadastrado no banco");
                    db.close();
                }
            });
        });
    };

    controller.registrarPosicao = function (req, res) {
        //try {
        app.usuario.latitude = req.body.latitude;
        app.usuario.longitude = req.body.longitude;
        console.log("Latitude: " + app.usuario.latitude + "\nLongitude: " + app.usuario.longitude);
        console.log("Posição: " + req.body);
        res.status(200).send("Latitude e longitude registrada!");
        /* } catch (error) {
            console.log("Impossível registrar a latitude e longitude\nErro: " + error);
            res.status(500).send("Impossível registrar a latitude e longitude");
        } */
    }

    //Função que busca pefil do consumidor
    controller.buscarPerfil = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { _id: app.usuario.id };
                dbo.collection("Consumidor").findOne(query, function (error, result) {
                    if (error) {
                        console.log("Erro ao buscar o perfil do consumidor no banco");
                        res.status(500).send("Erro ao buscar o perfil do consumidor no banco");
                    } else {
                        if (result != null) {
                            console.log(result);
                            res.status(200).send(result);
                            db.close();
                        } else {
                            console.log("consumidor não encontrado!");
                            res.status(404).send("consumidor não encontrado!");
                        }
                    }
                });
            };
        });
    };

    //Função que busca a lista de favoritos do consumidor
    controller.buscarFavoritos = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { consumidor: app.usuario.id };
                dbo.collection("Favorito").find(query).toArray(function (error, result) {
                    if (error) {
                        console.log("Erro ao buscar o produto no banco");
                        res.status(500).send("Erro ao buscar o produto no banco");
                    } else {
                        if (result != null) {
                            res.status(200).send(result);
                            db.close();
                        }
                    }
                });
            }
        });
    }

    //Função que busca pefil do estabelecimento do produto
    controller.buscarEstabelecimento = function (req, res) {
        console.log(req.body);
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { _id: req.body.chave };
                dbo.collection("Estabelecimento").findOne(query, function (error, result) {
                    if (error) {
                        console.log("Erro ao buscar o estabelecimento no banco");
                        res.status(500).send("Erro ao buscar o estabelecimento no banco");
                    } else {
                        if (result != null) {
                            console.log(result);
                            res.status(200).send(result);
                            db.close();
                        } else {
                            console.log("Estabelecimento não encontrado!");
                            res.status(404).send("Estabelecimento não encontrado!");
                        }
                    }
                });
            };
        });
    }

    // Função que favorita o produto selecionado
    controller.favoritarProduto = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao conectar o banco");
                res.status(500).send("Erro ao conectar o banco");
            }
            // Criando o objeto a ser inserido
            var myObj = req.body;
            myObj.consumidor = app.usuario.id;
            dbo.collection("Favorito").insertOne(myObj, function (err, resp) {
                if (err) {
                    console.log("Erro ao favoritar o produto");
                    res.status(500).send("Erro ao favoritar o produto");
                } else {
                    res.status(200).send("Produto favoritado");
                    db.close();
                }
            });
        });
    };

    //Função que exclui um produto favorito do consumidor
    controller.excluirFavorito = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { "_id": req.body._id };
                dbo.collection("Favorito").deleteOne(query, function (error, result) {
                    if (error) {
                        console.log("Erro ao deletar o produto no banco");
                        res.status(500).send("Erro ao deletar o produto no banco");
                    } else {
                        console.log("Deletado" + result);
                        res.status(200).send("Deletado");
                        db.close();
                    }
                });
            };
        });
    };


    //Função que edita o perfil do Estabelecimento
    controller.editarPerfil = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { _id: app.usuario.id };
                var myObj = {
                    $set: {
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha
                    }
                }
                dbo.collection("Consumidor").updateOne(query, myObj, function (error, result) {
                    if (error) {
                        console.log("Erro ao atualizar o consumidor no banco");
                        res.status(500).send("Erro ao atualizar o consumidor no banco");
                    } else {
                        console.log("Atualizado");
                        res.status(200).send("Atualizado");
                        db.close();
                    }
                });
            };
        });
    };

    //Função que busca os produtos cadastrados
    controller.buscarProduto = function (req, res) {
        var pesquisa = req.body;
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { nome: { $regex: pesquisa.nome, $options: '$i' } };
                dbo.collection("ProdutoCadastrado").find(query).toArray(function (error, result) {
                    if (error) {
                        console.log("Erro ao buscar o produto no banco");
                        res.status(500).send("Erro ao buscar o produto no banco");
                    } else {
                        if (result != null) {
                            var arrayDefinitivo = [];
                            return new Promise((resolve, reject) => {
                                result.forEach(function (produto) {
                                    var r = 6371.0;
                                    var longitude = parseFloat(app.usuario.longitude) * Math.PI / 180.0;
                                    var latitude = parseFloat(app.usuario.latitude) * Math.PI / 180.0;
                                    var prodLongitude = parseFloat(produto.longitude) * Math.PI / 180.0;
                                    var prodLatitude = parseFloat(produto.latitude) * Math.PI / 180.0;
                                    var dLat = prodLatitude - latitude;
                                    var dLon = prodLongitude - longitude;

                                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(prodLatitude) * Math.cos(prodLatitude) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                    var distancia = parseFloat((Math.round((r * c * 1000) / 1000)).toFixed(2));
                                    if (parseInt(pesquisa.distancia) >= distancia) {
                                        produto.distancia = distancia;
                                        arrayDefinitivo.push(produto);
                                    }
                                });
                                resolve(arrayDefinitivo);
                                reject(null);
                            })
                                .then(function (arrayDefinitivo) {
                                    res.status(200).send(arrayDefinitivo);
                                    db.close();
                                })
                                .catch(function (b) {
                                    console.log("Erro ao calcular distância");
                                    res.status(500).send("Erro ao calcular distância");
                                });
                        } else {
                            console.log("Nenhum produto encontrado!");
                            res.status(404).send("Nenhum produto encontrado!");
                        }
                    }
                });
            }
        });
    };

    //Função que dá logout no estabelecimento
    controller.sair = function (req, res) {
        app.usuario = {};
        res.status(200).send('Deslogado!');
    };

    //Retorna a controller
    return controller;
}