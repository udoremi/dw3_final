const db = require("../../../database/databaseconfig");

const getAllPedidos = async () => {
  return (
    await db.query(
      "SELECT *, (SELECT nome_completo from CLIENTES where id_cliente = pedidos.id_cliente) " +
        "FROM pedidos WHERE status != 'Cancelado' ORDER BY data_pedido DESC"
    )
  ).rows;
};

const getPedidoByID = async (pedidoIDPar) => {
  return (
    await db.query(
      "SELECT *, (SELECT nome_completo from CLIENTES where id_cliente = pedidos.id_cliente) " +
        "FROM pedidos WHERE id_pedido = $1 AND status != 'Cancelado' ORDER BY data_pedido DESC",
      [pedidoIDPar]
    )
  ).rows;
};

const insertPedidos = async (pedidoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO pedidos " + "values(default, $1, $2, $3, $4, $5)",
        [
          pedidoREGPar.id_cliente,
          pedidoREGPar.data_pedido,
          pedidoREGPar.status,
          pedidoREGPar.valor_total,
          pedidoREGPar.observacoes,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPedidos|insertPedidos] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const updatePedidos = async (pedidoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pedidos SET " +
          "id_cliente = $2, " +
          "data_pedido = $3, " +
          "status = $4, " +
          "valor_total = $5, " +
          "observacoes = $6 " +
          "WHERE id_pedido = $1",
        [
          pedidoREGPar.id_pedido,
          pedidoREGPar.id_cliente,
          pedidoREGPar.data_pedido,
          pedidoREGPar.status,
          pedidoREGPar.valor_total,
          pedidoREGPar.observacoes,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPedidos|updatePedidos] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const deletePedidos = async (pedidoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
    
  try {
    linhasAfetadas = (
    await db.query(
      "UPDATE pedidos SET " + "status = 'Cancelado' " + "WHERE id_pedido = $1",
      [pedidoREGPar.id_pedido]
    )
  ).rowCount;
} catch (error) {
  msg = "[mdlPedidos|deletePedidos] " + error.detail;
  linhasAfetadas = -1;
}

return { msg, linhasAfetadas };
};

module.exports = {
  getAllPedidos,
  getPedidoByID,
  insertPedidos,
  updatePedidos,
  deletePedidos,
};