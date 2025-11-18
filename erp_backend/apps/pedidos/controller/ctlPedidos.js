const mdlPedidos = require("../model/mdlPedidos");

const getAllPedidos = (req, res) =>
  (async () => {
    let registro = await mdlPedidos.getAllPedidos();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i];
      const formattedDate = row.data_pedido.toISOString().split('T')[0];
      row.data_pedido = formattedDate;
      
    }
    res.json({ status: "ok", "registro": registro });
  })();

const getPedidoByID = (req, res) =>
  (async () => {
    const pedidoID = parseInt(req.body.id_pedido);
    let registro = await mdlPedidos.getPedidoByID(pedidoID);

    res.json({ status: "ok", "registro": registro });
  })();

const insertPedidos = (request, res) =>
  (async () => {
    const pedidoREG = request.body;
    let { msg, linhasAfetadas } = await mdlPedidos.insertPedidos(pedidoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updatePedidos = (request, res) =>
  (async () => {
    const pedidoREG = request.body;
    let { msg, linhasAfetadas } = await mdlPedidos.updatePedidos(pedidoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const deletePedidos = (request, res) =>
  (async () => {
    const pedidoREG = request.body;
    let { msg, linhasAfetadas } = await mdlPedidos.deletePedidos(pedidoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllPedidos,
  getPedidoByID,
  insertPedidos,
  updatePedidos,
  deletePedidos
};