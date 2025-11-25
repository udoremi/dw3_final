const db = require('../../../database/databaseconfig');

const getAllPedidos = async () => {
  return (
    await db.query(
      'SELECT *, (SELECT nome_completo from CLIENTES where id_cliente = pedidos.id_cliente) ' +
        "FROM pedidos WHERE status != 'Cancelado' ORDER BY data_pedido DESC",
    )
  ).rows;
};

const getPedidoByID = async (pedidoIDPar) => {
  const pedidoRows = (
    await db.query(
      'SELECT *, (SELECT nome_completo from CLIENTES where id_cliente = pedidos.id_cliente) ' +
        "FROM pedidos WHERE id_pedido = $1 AND status != 'Cancelado'",
      [pedidoIDPar],
    )
  ).rows;

  if (pedidoRows.length > 0) {
    const itensRows = (
      await db.query(
        'SELECT i.*, p.nome ' +
          'FROM itens_pedido i ' +
          'JOIN produtos p ON i.id_produto = p.id_produto ' +
          'WHERE i.id_pedido = $1',
        [pedidoIDPar],
      )
    ).rows;
    pedidoRows[0].itens = itensRows;
  }

  return pedidoRows;
};

const insertPedidos = async (pedidoREGPar) => {
  let linhasAfetadas;
  let msg = 'ok';
  try {
    const result = await db.query(
      'INSERT INTO pedidos ' +
        'values(default, $1, $2, $3, $4, $5) RETURNING id_pedido',
      [
        pedidoREGPar.id_cliente,
        pedidoREGPar.data_pedido,
        pedidoREGPar.status,
        pedidoREGPar.valor_total,
        pedidoREGPar.observacoes,
      ],
    );

    linhasAfetadas = result.rowCount;
    const novoIdPedido = result.rows[0].id_pedido;

    if (pedidoREGPar.itens && pedidoREGPar.itens.length > 0) {
      for (const item of pedidoREGPar.itens) {
        await db.query('INSERT INTO itens_pedido values($1, $2, $3, $4)', [
          novoIdPedido,
          item.id_produto,
          item.quantidade,
          item.preco_unitario,
        ]);
      }
    }

    if (pedidoREGPar.status === 'Concluído' && pedidoREGPar.itens) {
      for (const item of pedidoREGPar.itens) {
        await db.query(
          'UPDATE produtos SET estoque_atual = estoque_atual - $1 WHERE id_produto = $2',
          [item.quantidade, item.id_produto],
        );
      }
    }
  } catch (error) {
    msg = '[mdlPedidos|insertPedidos] ' + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const updatePedidos = async (pedidoREGPar) => {
  let linhasAfetadas;
  let msg = 'ok';
  try {
    const buscaAntiga = await db.query(
      'SELECT status FROM pedidos WHERE id_pedido = $1',
      [pedidoREGPar.id_pedido],
    );

    if (
      buscaAntiga.rows.length > 0 &&
      buscaAntiga.rows[0].status === 'Concluído'
    ) {
      return {
        msg: 'Erro: Pedido já concluído não pode ser editado.',
        linhasAfetadas: 0,
      };
    }

    linhasAfetadas = (
      await db.query(
        'UPDATE pedidos SET ' +
          'id_cliente = $2, ' +
          'data_pedido = $3, ' +
          'status = $4, ' +
          'valor_total = $5, ' +
          'observacoes = $6 ' +
          'WHERE id_pedido = $1',
        [
          pedidoREGPar.id_pedido,
          pedidoREGPar.id_cliente,
          pedidoREGPar.data_pedido,
          pedidoREGPar.status,
          pedidoREGPar.valor_total,
          pedidoREGPar.observacoes,
        ],
      )
    ).rowCount;

    await db.query('DELETE FROM itens_pedido WHERE id_pedido = $1', [
      pedidoREGPar.id_pedido,
    ]);

    if (pedidoREGPar.itens && pedidoREGPar.itens.length > 0) {
      for (const item of pedidoREGPar.itens) {
        await db.query('INSERT INTO itens_pedido values($1, $2, $3, $4)', [
          pedidoREGPar.id_pedido,
          item.id_produto,
          item.quantidade,
          item.preco_unitario,
        ]);
      }
    }

    if (
      buscaAntiga.rows[0].status !== 'Concluído' &&
      pedidoREGPar.status === 'Concluído'
    ) {
      for (const item of pedidoREGPar.itens) {
        await db.query(
          'UPDATE produtos SET estoque_atual = estoque_atual - $1 WHERE id_produto = $2',
          [item.quantidade, item.id_produto],
        );
      }
    }
  } catch (error) {
    msg = '[mdlPedidos|updatePedidos] ' + error.detail;
    linhasAfetadas = -1;
    console.error(error);
  }

  return { msg, linhasAfetadas };
};

const deletePedidos = async (pedidoREGPar) => {
  let linhasAfetadas;
  let msg = 'ok';

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pedidos SET status = 'Cancelado' WHERE id_pedido = $1",
        [pedidoREGPar.id_pedido],
      )
    ).rowCount;
  } catch (error) {
    msg = '[mdlPedidos|deletePedidos] ' + error.detail;
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
