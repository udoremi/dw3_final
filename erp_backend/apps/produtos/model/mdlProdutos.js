const db = require("../../../database/databaseconfig");

const getAllProdutos = async () => {
  return (
    await db.query(
      "SELECT * " + "FROM produtos where ativo = true ORDER BY nome ASC"
    )
  ).rows;
};

const getProdutoByID = async (produtoIDPar) => {
  return (
    await db.query(
      "SELECT * " +
        "FROM produtos WHERE id_produto = $1 and ativo = true ORDER BY nome ASC",
      [produtoIDPar]
    )
  ).rows;
};

const insertProdutos = async (produtoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO produtos " + "values(default, $1, $2, $3, $4, $5)",
        [
          produtoREGPar.nome,
          produtoREGPar.descricao,
          produtoREGPar.preco,
          produtoREGPar.estoque_atual,
          produtoREGPar.ativo,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlProdutos|insertProdutos] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const updateProdutos = async (produtoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE produtos SET " +
          "nome = $2, " +
          "descricao = $3, " +
          "preco = $4, " +
          "estoque_atual = $5, " +
          "ativo = $6 " +
          "WHERE id_produto = $1",
        [
          produtoREGPar.id_produto,
          produtoREGPar.nome,
          produtoREGPar.descricao,
          produtoREGPar.preco,
          produtoREGPar.estoque_atual,
          produtoREGPar.ativo,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlProdutos|updateProdutos] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const deleteProdutos = async (produtoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
    
  try {
    linhasAfetadas = (
    await db.query(
      "UPDATE produtos SET " + "ativo = false " + "WHERE id_produto = $1",
      [produtoREGPar.id_produto]
    )
  ).rowCount;
} catch (error) {
  msg = "[mdlProdutos|deleteProdutos] " + error.detail;
  linhasAfetadas = -1;
}

return { msg, linhasAfetadas };
};

module.exports = {
  getAllProdutos,
  getProdutoByID,
  insertProdutos,
  updateProdutos,
  deleteProdutos,
};