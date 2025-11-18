const mdlProdutos = require("../model/mdlProdutos");

const getAllProdutos = (req, res) =>
  (async () => {
    let registro = await mdlProdutos.getAllProdutos();
    res.json({ status: "ok", registro: registro });
  })();

const getProdutoByID = (req, res) =>
  (async () => {
    const produtoID = parseInt(req.body.id_produto);
    let registro = await mdlProdutos.getProdutoByID(produtoID);

    res.json({ status: "ok", registro: registro });
  })();

const insertProdutos = (request, res) =>
  (async () => {
    const registro = request.body;
    let { msg, linhasAfetadas } = await mdlProdutos.insertProdutos(registro);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const updateProdutos = (request, res) =>
  (async () => {
    const registro = request.body;
    let { msg, linhasAfetadas } = await mdlProdutos.updateProdutos(registro);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const deleteProdutos = (request, res) =>
  (async () => {
    const registro = request.body;
    let { msg, linhasAfetadas } = await mdlProdutos.deleteProdutos(registro);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

module.exports = {
  getAllProdutos,
  getProdutoByID,
  insertProdutos,
  updateProdutos,
  deleteProdutos
};