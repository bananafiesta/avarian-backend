import mysql from 'mysql';
import 'dotenv/config';

export function leaderboardDb() {

const connection = mysql.createConnection({
  host: process.env.AURASKILLS_HOST,
  port: parseInt(process.env.AURASKILLS_PORT),
  user: process.env.AURASKILLS_USER,
  password: process.env.AURASKILLS_PASSWORD,
  database: process.env.AURASKILLS_DB
  
});

connection.connect();
// connection.query('DESCRIBE auraskills_users', (err, rows, fields) => {
//   if (err) throw err;

//   console.log(rows);
// })

connection.query("SELECT users.player_uuid, SUM(skills.skill_level) as total FROM auraskills_skill_levels AS skills INNER JOIN auraskills_users as users ON users.user_id = skills.user_id GROUP BY users.user_id ORDER BY total DESC, SUM(skills.skill_xp) DESC LIMIT 25", (err, rows, fields) => {
  if (err) throw err;
  console.log(rows);
  connection.end();
  return JSON.stringify(rows);
})
connection.end();

}
