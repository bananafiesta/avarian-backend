import mysql from 'mysql';
import 'dotenv/config';

export function queryLeaderboard(): Promise<string> {

const connection = mysql.createConnection({
  host: process.env.AURASKILLS_HOST,
  port: parseInt(process.env.AURASKILLS_PORT),
  user: process.env.AURASKILLS_USER,
  password: process.env.AURASKILLS_PASSWORD,
  database: process.env.AURASKILLS_DB
  
});

connection.connect();

const query = "SELECT users.player_uuid, SUM(skills.skill_level) as total FROM auraskills_skill_levels AS skills INNER JOIN auraskills_users as users ON users.user_id = skills.user_id GROUP BY users.user_id ORDER BY total DESC, SUM(skills.skill_xp) DESC LIMIT 25"
return new Promise((resolve, reject) => {
  connection.query(query, (err, rows, fields) => {
    if (err) {
      return reject(err);
    }
    resolve(rows);
  })
})
// connection.query(query, (err, rows, fields) => {
//   if (err) {

//   };
//   console.log(rows);
//   connection.end();
//   return rows;
// })
// connection.end();


}
