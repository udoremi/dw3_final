const db = require("../../../database/databaseconfig");

const getAllClientes = async () => {
  return (
    await db.query(
      "SELECT * " +
        "FROM clientes where ativo = true ORDER BY nome_completo ASC"
    )
  ).rows;
};

const getClienteByID = async (clienteIDPar) => {
  return (
    await db.query(
      "SELECT * " +
        "FROM clientes WHERE id_cliente = $1 and ativo = true ORDER BY nome_completo ASC",
      [clienteIDPar]
    )
  ).rows;
};

const insertClientes = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO clientes " + "values(default, $1, $2, $3, $4, $5, $6, $7)",
        [
          clienteREGPar.nome_completo,
          clienteREGPar.email,
          clienteREGPar.cpf_cnpj,
          clienteREGPar.telefone,
          clienteREGPar.endereco,
          clienteREGPar.data_cadastro,
          clienteREGPar.ativo,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlClientes|insertClientes] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const updateClientes = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE clientes SET " +
          "nome_completo = $2, " +
          "email = $3, " +
          "cpf_cnpj = $4, " +
          "telefone = $5, " +
          "endereco = $6, " +
          "data_cadastro = $7, " +
          "ativo = $8 " +
          "WHERE id_cliente = $1",
        [
          clienteREGPar.id_cliente,
          clienteREGPar.nome_completo,
          clienteREGPar.email,
          clienteREGPar.cpf_cnpj,
          clienteREGPar.telefone,
          clienteREGPar.endereco,
          clienteREGPar.data_cadastro,
          clienteREGPar.ativo,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlClientes|updateClientes] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const deleteClientes = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
    
  try {
    linhasAfetadas = (
    await db.query(
      "UPDATE clientes SET " + "ativo = false " + "WHERE id_cliente = $1",
      [clienteREGPar.id_cliente]
    )
  ).rowCount;
} catch (error) {
  msg = "[mdlClientes|deleteClientes] " + error.detail;
  linhasAfetadas = -1;
}

return { msg, linhasAfetadas };
};

module.exports = {
  getAllClientes,
  getClienteByID,
  insertClientes,
  updateClientes,
  deleteClientes,
};