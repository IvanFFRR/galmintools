
async function UpdateOpalsCount() {
    var form = document.getElementById("Form");
    var opals = form.elements.namedItem("Opals");
    var miners = form.elements.namedItem("Miners");

    var maxYieldDice = miners.value;
    var dice = [0, 4, 6, 8, 10, 12, 20]
    while(!dice.includes(parseInt(maxYieldDice))) {
        maxYieldDice--;
    }

    if(maxYieldDice > 0)
        document.getElementById("maxYieldDice").innerHTML = `(1d${maxYieldDice})`;
    else 
    document.getElementById("maxYieldDice").innerHTML = `(0)`;

    opals.max = maxYieldDice;
    if (parseInt(miners.value) < parseInt(opals.value)) {
        opals.value = miners.value;
    }
};

async function Init() {
    UpdateOpalsCount();
}


var networth = 0;
var json = [];
function MineOpals() {
    var table = document.getElementById("Table");
    var row = table.insertRow(1)

    var form = document.getElementById("Form");
    var opals = form.elements.namedItem("Opals");
    var jeweller = form.elements.namedItem("Jeweller");
    var miners = form.elements.namedItem("Miners");

    opals.max = miners.value;

    row.insertCell(0).innerHTML = opals.value;
    row.insertCell(1).innerHTML = jeweller.checked ? "Sí" : "No";
    row.insertCell(2).innerHTML = miners.value;
    
    var gross = opals.value * (jeweller.checked ? 1000 : 200);
    var jewellersFee = (jeweller.checked ? 2 : 0) * 7;
    var minersFee = miners.value * 0.2 * 7;
    var net = gross - jewellersFee - minersFee;
    var playersProfit = net / 5;
    var grossFormatted = `${gross} de oro`

    var jewellersFeeFormatted = "";
    if (jeweller.checked) jewellersFeeFormatted += `${jewellersFee} de oro`;

    
    var minersFeeFormatted = FormatCoins(minersFee);
    var netFormatted = FormatCoins(net);
    var playerProfitFormatted = FormatCoins(playersProfit);

    row.insertCell(3).innerHTML = grossFormatted;
    row.insertCell(4).innerHTML = jewellersFeeFormatted;
    row.insertCell(5).innerHTML = minersFeeFormatted;
    row.insertCell(6).innerHTML = netFormatted;
    row.insertCell(7).innerHTML = playerProfitFormatted
    networth += net;
    var span = document.getElementById("NetWorthNumber");
    span.innerText = FormatCoins(networth);

    var object = {
        week: week,
        opals: parseInt(opals.value),
        grossProfit: gross,
        jeweller: jeweller.checked,
        jewellersFee: jewellersFee,
        miners: parseInt(miners.value),
        minersFee: minersFee,
        netProfit: net,
        playerProfit: playersProfit
    }


}

function FormatCoins(number) {
    var gold = Math.floor(number);
    var silver = (number - gold) * 10;
    var copper = Math.round((silver - Math.floor(silver)) * 10);
    if(copper >= 10) {
        silver++;
        copper =- 10;
    }

    var total = gold > 0 ? `${gold} de oro` : "";
    if (silver > 0) total += ` ${Math.floor(silver)} de plata`;
    if(copper > 0) total += ` ${copper} de cobre`;

    return total;
}