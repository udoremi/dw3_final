const express = require("express");
const routerApp = express.Router();

const appLogin = require("../apps/login/controller/ctlLogin");
const appClientes = require("../apps/clientes/controller/ctlClientes");
const appPedidos = require("../apps/pedidos/controller/ctlPedidos");
const appProdutos = require("../apps/produtos/controller/ctlProdutos");

routerApp.use((req, res, next) => {
  next();
});

routerApp.get("/", (req, res) => {
  res.send("Olá mundo!");
});

routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

routerApp.get("/getAllClientes", appLogin.AutenticaJWT, appClientes.getAllClientes);
routerApp.post("/getClienteByID", appLogin.AutenticaJWT, appClientes.getClienteByID);
routerApp.post("/insertClientes", appLogin.AutenticaJWT, appClientes.insertClientes);
routerApp.post("/updateClientes", appLogin.AutenticaJWT, appClientes.updateClientes);
routerApp.post("/deleteClientes", appLogin.AutenticaJWT, appClientes.deleteClientes);

routerApp.get("/getAllPedidos", appLogin.AutenticaJWT, appPedidos.getAllPedidos);
routerApp.post("/getPedidoByID", appLogin.AutenticaJWT, appPedidos.getPedidoByID);
routerApp.post("/insertPedidos", appLogin.AutenticaJWT, appPedidos.insertPedidos);
routerApp.post("/updatePedidos", appLogin.AutenticaJWT, appPedidos.updatePedidos);
routerApp.post("/deletePedidos", appLogin.AutenticaJWT, appPedidos.deletePedidos);

routerApp.get("/getAllProdutos", appLogin.AutenticaJWT, appProdutos.getAllProdutos);
routerApp.post("/getProdutoByID", appLogin.AutenticaJWT, appProdutos.getProdutoByID);
routerApp.post("/insertProdutos", appLogin.AutenticaJWT, appProdutos.insertProdutos);
routerApp.post("/updateProdutos", appLogin.AutenticaJWT, appProdutos.updateProdutos);
routerApp.post("/deleteProdutos", appLogin.AutenticaJWT, appProdutos.deleteProdutos);

module.exports = routerApp;