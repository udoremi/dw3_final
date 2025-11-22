const db = require("../../../database/databaseconfig");

const GetReceitaTotal = async () => {
    return (
        await db.query(
            "SELECT SUM(valor_total) as total FROM pedidos WHERE status != 'Cancelado'"
        )
    ).rows;
};

const GetTotalPedidos = async () => {
    return (
        await db.query(
            "SELECT COUNT(*) as total FROM pedidos"
        )
    ).rows;
};

const GetTotalClientesAtivos = async () => {
    return (
        await db.query(
            "SELECT COUNT(*) as total FROM clientes WHERE ativo = true"
        )
    ).rows;
};

module.exports = {
    GetReceitaTotal,
    GetTotalPedidos,
    GetTotalClientesAtivos,
};