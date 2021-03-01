// import { pool } from './postgres.js'
const pool = require('./postgres').pool

module.exports = {
    async GetAlltimeYieldFormatted() { return await GetAlltimeYieldFormatted() },
    async AddNewYield(yield) { await AddNewYield(yield) },
    async GetTotalProfit() { return await GetTotalProfit() },
    MineOpals(opals, jeweller, miners) { return MineOpals(parseInt(opals), jeweller, parseInt(miners)) }
}

async function GetAlltimeYield() {
    var response = await pool.query('SELECT * FROM MineYield ORDER BY week DESC');
    return response.rows;
}

async function GetTotalProfit() {
    var response = await pool.query('SELECT SUM(netprofit) FROM MineYield');
    return FormatCoins(response.rows[0].sum)
}

async function GetAlltimeYieldFormatted() {
    var rows = await GetAlltimeYield();
    formattedRows = []
    for (var row of rows) {
        formattedRows.push(FormatRow(row))
    }
    return formattedRows
}

function MineOpals(opals, jeweller, miners) {
    var gross = opals * (jeweller ? 1000 : 200);
    var jewellersFee = (jeweller ? 2 : 0) * 7;
    var minersFee = miners * 0.2 * 7;
    var net = gross - jewellersFee - minersFee;
    var playersProfit = net / 5;
    var grossFormatted = `${gross} de oro`

    var jewellersFeeFormatted = "";
    if (jeweller) jewellersFeeFormatted += `${jewellersFee} de oro`;

    var object = {
        opals: opals,
        grossProfit: gross,
        jeweller: jeweller,
        jewellersFee: jewellersFee,
        miners: miners,
        minersFee: Math.round(minersFee * 100) / 100,
        netProfit: Math.round(net * 100) / 100,
        playerProfit: Math.round(playersProfit * 100) / 100
    }

    return object;
}

function FormatRow(row) {
    var grossProfitFormatted = FormatCoins(row.grossprofit);
    var jewellersFeeFormatted = FormatCoins(row.jewellersfee);
    var minersFeeFormatted = FormatCoins(row.minersfee);
    var netFormatted = FormatCoins(row.netprofit);
    var playerProfitFormatted = FormatCoins(row.playerprofit);

    return {
        opals: row.opals,
        grossprofit: grossProfitFormatted,
        jeweller: row.jeweller ? "Sí" : "No",
        jewellersfee: jewellersFeeFormatted,
        netprofit: netFormatted,
        playerprofit: playerProfitFormatted,
        miners: row.miners,
        minersfee: minersFeeFormatted
    }

}

function FormatCoins(number) {
    var gold = Math.floor(number);
    var silver = (number - gold) * 10;
    var copper = Math.round((silver - Math.floor(silver)) * 10);
    if (copper >= 10) {
        silver++;
        copper = - 10;
    }

    var total = gold > 0 ? `${gold} de oro` : "";
    if (silver > 0) total += ` ${Math.floor(silver)} de plata`;
    if (copper > 0) total += ` ${copper} de cobre`;

    if (total.length == 0) total = '0'
    return total;
}

/*
{
    week: week,
    opals: parseInt(opals.value),
    grossProfit: gross,
    jeweller: jeweller.checked,
    jewellersFee: jewellersFee,
    miners: parseInt(miners.value),
    minersFee: minersFee,
    netProfit: net,
    playerProfit: playersProfit
}*/
async function AddNewYield(y) {
    var query = 'INSERT INTO MineYield (opals, grossprofit, jeweller, jewellersfee, miners, minersfee, netprofit, playerprofit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    var params =
        [
            y.opals,
            y.grossProfit,
            y.jewellers ? 1 : 0,
            y.jewellersFee,
            y.miners,
            y.minersFee,
            y.netProfit,
            y.playerProfit
        ]
    pool.query(query, params, (error, response) => {
        if (error) console.error('Error', error.stack)
        else console.debug(response.rows);
    })
}