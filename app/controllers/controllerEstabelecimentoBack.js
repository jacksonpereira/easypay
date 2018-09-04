var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";

// Array com objetos contato
module.exports = function (app) {
    //Cria uma variável que armazena um objeto controller
    var controller = {};

    //Função de cadastro de m estabelecimento no Mongo
    controller.cadastro = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // Criando o objeto a ser inserido
                var myObj = {
                    _id: req.body.cnpj,
                    nome_fantasia: req.body.nome_fantasia,
                    razao_social: req.body.razao_social,
                    telefone: req.body.telefone,
                    logradouro: req.body.logradouro,
                    numero: req.body.numero,
                    complemento: req.body.complemento,
                    bairro: req.body.bairro,
                    cidade: req.body.cidade,
                    estado: req.body.estado,
                    lat: req.body.lat,
                    lng: req.body.lng,
                    email: req.body.email,
                    senha: req.body.senha
                }
                // Inserindo no banco
                dbo.collection("Estabelecimento").insertOne(myObj, function (error, resp) {
                    if (error) {
                        console.log("Erro ao inserir o estabelecimento no banco");
                        res.status(500).send("Erro ao inserir no banco");
                    } else {
                        res.send('Cadastrado no banco!');
                        db.close();
                    }
                });
            }
        });
    };

    //Função que retorna todos os produtos do sistema
    controller.produtosSistema = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { nome: { $regex: req.body.nome, $options: '$i' } };
                dbo.collection("Produto").find(query).toArray(function (error, result) {
                    if (error) {
                        console.log("Erro ao buscar os produtos no banco");
                        res.status(500).send("Erro ao buscar os produtos no banco");
                    } else {
                        if (result != null) {
                            res.status(200).json(result);
                            db.close();
                        } else {
                            console.log("Produto não encontrado!");
                            res.status(404).send("Produto não encontrado!");
                        }
                    }
                });
            };
        });
    }

    //Função que cadastra o produto no banco
    controller.cadastrarProduto = function (req, res) {
        var myObj = {
            codigoDeBarras: req.body._id,
            nome: req.body.nome,
            descricao: req.body.descricao,
            peso: req.body.peso,
            valor: req.body.valor,
            imagem: req.body.imagem,
            latitude: app.usuario.latitude,
            longitude: app.usuario.longitude,
            estabelecimento: app.usuario.id
        };
        myObj.estabelecimento = app.usuario.id;
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // Inserindo no banco
                dbo.collection("ProdutoCadastrado").insertOne(myObj, function (error, resp) {
                    if (error) {
                        console.log("Erro ao inserir o produto no banco");
                        res.status(500).send("Erro ao inserir o produto no banco");
                    } else {
                        res.status(200).send('Cadastrado no banco!');
                        db.close();
                    }
                });
            };
        });
    };

    //Função que lista os produtos do estabelecimento
    controller.listaMeusProdutos = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { estabelecimento: app.usuario.id };
                dbo.collection("ProdutoCadastrado").find(query).toArray(function (error, result) {
                    if (error) {
                        console.log("Erro ao buscar os produtos no banco");
                        res.status(500).send("Erro ao buscar os produtos no banco");
                    } else {
                        if (result != null) {
                            res.status(200).send(result);
                            db.close();
                        } else {
                            console.log("Produto não encontrado!");
                            res.status(404).send("Produto não encontrado!");
                        }
                    }
                });
            };
        });
    };

    //Função que exclui um produto do estabelecimento
    controller.excluirProduto = function (req, res) {
        console.log("estabelecimento: " + req.body.estabelecimento);
        console.log("\ncodigoDeBarras: " + req.body.codigoDeBarras);
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                //var query = { '_id': req.body.chave };
                var query = { "_id": ObjectId(req.body._id) };
                dbo.collection("ProdutoCadastrado").deleteOne(query, function (error, result) {
                    if (error) {
                        console.log("Erro ao deletar o produto no banco");
                        res.status(500).send("Erro ao deletar o produto no banco");
                    } else {
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
                        nome_fantasia: req.body.nome_fantasia,
                        razao_social: req.body.razao_social,
                        telefone: req.body.telefone,
                        logradouro: req.body.logradouro,
                        numero: req.body.numero,
                        complemento: req.body.complemento,
                        bairro: req.body.bairro,
                        cidade: req.body.cidade,
                        estado: req.body.estado,
                        lat: req.body.lat,
                        lng: req.body.lng,
                        email: req.body.email,
                        senha: req.body.senha
                    }
                }
                dbo.collection("Estabelecimento").updateOne(query, myObj, function (error, result) {
                    if (error) {
                        console.log("Erro ao atualizar o estabelecimento no banco");
                        res.status(500).send("Erro ao atualizar o estabelecimento no banco");
                    } else {
                        console.log("Atualizado");
                        res.status(200).send("Atualizado");
                        db.close();
                    }
                });
            };
        });
    }

    //Função que busca pefil do estabelecimento
    controller.buscarPerfil = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { _id: app.usuario.id };
                dbo.collection("Estabelecimento").findOne(query, function (error, result) {
                    if (error) {
                        console.log("Erro ao buscar os produtos no banco");
                        res.status(500).send("Erro ao buscar os produtos no banco");
                    } else {
                        if (result != null) {
                            console.log(result);
                            res.status(200).send(result);
                            db.close();
                        } else {
                            console.log("Produto não encontrado!");
                            res.status(404).send("Produto não encontrado!");
                        }
                    }
                });
            };
        });
    };

    controller.alterarValor = function (req, res) {
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("EasyPayDB");
            if (err) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                // pesquisando no banco
                var query = { '_id': ObjectId(req.body.chave) };
                var myObj = {
                    $set: {
                        valor: req.body.valor
                    }
                }
                dbo.collection("ProdutoCadastrado").updateOne(query, myObj, function (error, result) {
                    if (error) {
                        console.log("Erro ao atualizar o valor do produto no banco");
                        res.status(500).send("Erro ao atualizar o valor do produto no banco");
                    } else {
                        console.log("Atualizado");
                        res.status(200).send("Atualizado");
                        db.close();
                    }
                });
            };
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