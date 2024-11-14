import mysql from 'mysql';
import 'dotenv/config';

function newConnection() {
  return mysql.createConnection({
    host: process.env.XCONOMY_HOST,
    port: parseInt(process.env.XCONOMY_PORT),
    user: process.env.XCONOMY_USER,
    password: process.env.XCONOMY_PASSWORD,
    database: process.env.XCONOMY_DB
  })
}

export async function findUserEconomy(player_uuids: string[]): Promise<any[]> {
  const connection = newConnection();
  connection.connect();
  // const query = `SELECT balance FROM xconomy WHERE uid = '${player_uuid}'`
  const query = `SELECT balance, uid FROM xconomy WHERE uid in (?)`;
  // connection.query(query, (err, rows, fields) => {
  //   connection.end();
  //   if (err) throw err;
  //   console.log(rows);
  
  // })
  return new Promise((resolve, reject) => {
    // connection.query(query, (err, rows, fields) => {
    connection.query(query, [player_uuids], (err, rows, fields) => {
      connection.end();
      if (err) {
        return reject(err.message);
      }

      // Should look like [ RowDataPacket { balance: 50 } ]
      resolve(rows);
    })
  })
}
