var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost:27017/";

// Configurações do servidor de email
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');


// Array com objetos contato
module.exports = function (app) {
    //Cria uma variável que armazena um objeto controller
    var controller = {};

    //Cria uma função que acessa o login
    controller.login = function (req, res) {
        MongoClient.connect(url, function (erro, db) {
            var dbo = db.db("EasyPayDB");
            if (erro) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                var query = { email: req.body.email, senha: req.body.senha };
                //Pesquisa na tabela Estabelecimento
                dbo.collection("Estabelecimento").findOne(query, function (err, result) {
                    if (err) {
                        console.log("Erro ao buscar o estabelecimento no banco");
                        res.status(500).send("Erro ao buscar o estabelecimento no banco");
                    } else {
                        if (result != null) {
                            app.usuario = {
                                id: result._id,
                                latitude: result.lat,
                                longitude: result.lng
                            };
                            console.log("Logado estabelecimento\n" + app.usuario.id);
                            res.status(200).send("Estabelecimento");
                            db.close();
                        } else {
                            //Pesquisa na tabela Consumidor
                            dbo.collection("Consumidor").findOne(query, function (err, result) {
                                if (err) {
                                    console.log("Erro ao buscar o consumidor no banco");
                                    res.status(500).send("Erro ao buscar o consumidor no banco");
                                } else {
                                    if (result != null) {
                                        app.usuario = {
                                            id: result._id,
                                            latitude: "",
                                            longitude: ""
                                        };
                                        console.log("Logado consumidor\n" + app.usuario.id);
                                        res.status(200).send("Consumidor");
                                        db.close();
                                    } else {
                                        console.log("consumidor não encontrado");
                                        res.status(404).send("consumidor não encontrado");
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    };

    controller.lembrarSenha = function (req, res) {
        MongoClient.connect(url, function (erro, db) {
            var dbo = db.db("EasyPayDB");
            if (erro) {
                console.log("Erro ao abrir o banco");
                res.status(500).send("Erro ao abrir o banco");
            } else {
                var query = {
                    //email: req.body.chave
                    _id: req.body.chave
                };
                //Pesquisa na tabela Estabelecimento
                dbo.collection("Estabelecimento").findOne(query, function (err, result) {
                    if (err) {
                        console.log("Erro ao buscar o estabelecimento no banco");
                        res.status(500).send("Erro ao buscar o estabelecimento no banco");
                    } else {
                        if (result == null) {
                            //Pesquisa na tabela Consumidor
                            dbo.collection("Consumidor").findOne(query, function (err, result) {
                                if (err) {
                                    console.log("Erro ao buscar o estabelecimento no banco");
                                    res.status(500).send("Erro ao buscar o estabelecimento no banco");
                                } else {
                                    if (result == null) {
                                        console.log("Nenhum usuário encontrado!");
                                        res.status(404).send("Nenhum usuário encontrado!");
                                    } else {
                                        var msg = {
                                            to: result.email,
                                            from: 'easepayapp@gmail.com',
                                            subject: 'EasyPay - Lembrar senha',
                                            text: 'A senha foi enviada com sucesso!',
                                            html: 'Olá,' + result.nome + '!<br>A sua senha é <strong>' + result.senha + '</strong>',
                                        };
                                        sgMail.send(msg);
                                        console.log('Mensagem enviada com sucesso');
                                        res.status(200).send(result.email);
                                    }
                                }
                            });
                        } else {
                            var msg = {
                                to: result.email,
                                from: 'easepayapp@gmail.com',
                                subject: 'EasyPay - Lembrar senha',
                                text: 'A senha foi enviada com sucesso!',
                                html: 'Olá,' + result.razao_social + '!<br>A sua senha é <strong>' + result.senha + '</strong>',
                            };
                            sgMail.send(msg);
                            console.log('Mensagem enviada com sucesso');
                            res.status(200).send(result.email);
                        }
                    }
                });
            }
        });
    }

    //Retorna a controller
    return controller;
}