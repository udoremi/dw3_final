const mdlClientes = require("../model/mdlClientes");

const getAllClientes = (req, res) =>
  (async () => {
    let registro = await mdlClientes.getAllClientes();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i];  
      const formattedDate = row.data_cadastro.toISOString().split('T')[0];
      row.data_cadastro = formattedDate;
      
    }
    res.json({ status: "ok", "registro": registro });
  })();

const getClienteByID = (req, res) =>
  (async () => {
    const clienteID = parseInt(req.body.id_cliente);
    let registro = await mdlClientes.getClienteByID(clienteID);

    res.json({ status: "ok", "registro": registro });
  })();

const insertClientes = (request, res) =>
  (async () => {
    const clienteREG = request.body;
    let { msg, linhasAfetadas } = await mdlClientes.insertClientes(clienteREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updateClientes = (request, res) =>
  (async () => {
    const clienteREG = request.body;
    let { msg, linhasAfetadas } = await mdlClientes.updateClientes(clienteREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const deleteClientes = (request, res) =>
  (async () => {
    const clienteREG = request.body;
    let { msg, linhasAfetadas } = await mdlClientes.deleteClientes(clienteREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllClientes,
  getClienteByID,
  insertClientes,
  updateClientes,
  deleteClientes
};