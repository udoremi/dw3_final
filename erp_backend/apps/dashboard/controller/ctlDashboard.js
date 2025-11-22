const mdlDashboard = require("../model/mdlDashboard");

const GetMetrics = async (req, res) => {
    try {
        // Busca apenas os dados essenciais
        const [receitaRows, pedidosRows, clientesRows] = await Promise.all([
            mdlDashboard.GetReceitaTotal(),
            mdlDashboard.GetTotalPedidos(),
            mdlDashboard.GetTotalClientesAtivos(),
        ]);

        const receitaTotal = parseFloat(receitaRows[0].total || 0);
        const totalPedidos = parseInt(pedidosRows[0].total || 0);
        const totalClientes = parseInt(clientesRows[0].total || 0);

        // Cálculo do Ticket Médio
        const ticketMedio = totalPedidos > 0 ? receitaTotal / totalPedidos : 0;

        // Retorna JSON limpo
        res.json({
            receitaTotal,
            totalPedidos,
            totalClientes,
            ticketMedio
        });

    } catch (error) {
        console.error("Erro no Controller Dashboard:", error);
        res.status(500).json({ message: "Erro ao buscar métricas da dashboard." });
    }
};

module.exports = {
    GetMetrics,
};