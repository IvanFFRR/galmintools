const { pool } = require('./postgres')

async function GetYieldByWeek(week) {
    var response = await pool.query('SELECT * FROM DnDCharacters WHERE userid = $1::text', [userId])
    var record = Parse(response.rows)[0];

    return record;
}

async function GetAlltimeYield() {
    var response = await pool.query('SELECT * FROM Opals');
    return response.rows;
}

async function UpdateNickname(userid, nickname) {
    var newNickname = utils.UTF8ToBase64(nickname);
    pool.query('UPDATE DnDCharacters SET userdisplayname = $1::text WHERE userid = $2::text RETURNING userdisplayname', [newNickname, userid], (error, response) => {
        if (error) console.error('Error al actualizar nickname', error.stack)
        else console.log(Parse(response.rows)[0]);
    })

}

async function AddNewYield(yieldObect) {
    var query = 'INSERT INTO Opals VALUES ($1, $2, $3, $4, $5) RETURNING *';
    var params = [characterRecord.userid, utils.UTF8ToBase64(characterRecord.playername), utils.UTF8ToBase64(characterRecord.userdisplayname) ? utils.UTF8ToBase64(characterRecord.userdisplayname) : utils.UTF8ToBase64(characterRecord.playername), characterRecord.charactername];
    pool.query(query, params, (error, response) => {
        if (error) console.error('Error de registro', error.stack)
        else console.log(Parse(response.rows));
    })
}