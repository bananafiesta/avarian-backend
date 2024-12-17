import mysql from 'mysql';
import 'dotenv/config';

function newConnection() {
  return (
    mysql.createConnection({
      host: process.env.AURASKILLS_HOST,
      port: parseInt(process.env.AURASKILLS_PORT),
      user: process.env.AURASKILLS_USER,
      password: process.env.AURASKILLS_PASSWORD,
      database: process.env.AURASKILLS_DB
    })
  )
}

export const skills = [
  "agility",
  "alchemy",
  "archery",
  "defense",
  "enchanting",
  "excavation",
  "farming",
  "fighting",
  "fishing",
  "foraging",
  "mining",
  "total"
]

export async function queryLeaderboard(leaderboardOption: string): Promise<string> {
  let query = "";
  if (leaderboardOption == "total") {
    query = "SELECT users.player_uuid, SUM(skills.skill_level) as total FROM auraskills_skill_levels AS skills INNER JOIN auraskills_users as users ON users.user_id = skills.user_id GROUP BY users.user_id ORDER BY total DESC, SUM(skills.skill_xp) DESC LIMIT 25";
  } else if (skills.includes(leaderboardOption)) {
    query = `SELECT users.player_uuid, skills.skill_level as total FROM auraskills_skill_levels AS skills INNER JOIN auraskills_users as users ON users.user_id = skills.user_id WHERE skills.skill_name = 'auraskills/${leaderboardOption}' ORDER BY total DESC, skills.skill_xp DESC LIMIT 25`;
  } else {
    throw new Error("Invalid leaderboard option");
  }

  const connection = newConnection();
  connection.connect();

  return new Promise((resolve, reject) => {
    connection.query(query, (err, rows, fields) => {
      connection.end();
      if (err) {
        return reject(err.message);
      }
      resolve(rows);
    })
  })
}

export async function querySkill(option: string, uuid: string): Promise<{total: number}> {
  let query = "";
  if (option == "total") {
    query = `SELECT SUM(skills.skill_level) as total FROM auraskills_skill_levels AS skills INNER JOIN auraskills_users as users ON users.user_id = skills.user_id WHERE users.player_uuid = '${uuid}' LIMIT 1`
  } else if (skills.includes(option)) {
    query = `SELECT skills.skill_level as total FROM auraskills_skill_levels AS skills INNER JOIN auraskills_users as users ON users.user_id = skills.user_id WHERE users.player_uuid = '${uuid}' AND skills.skill_name = 'auraskills/${option}' LIMIT 1`
  } else {
    throw new Error("Invalid leaderboard option");
  }
  const connection = newConnection();
  connection.connect();
  return new Promise((resolve, reject) => {
    connection.query(query, (err, rows, fields) => {
      connection.end();
      if (err) {
        return reject(err.message);
      }
      resolve(rows);
    })
  })
}
// const connection = newConnection()
// connection.connect();
// const query = "SELECT * FROM auraskills_skill_levels"
// const test = new Promise((resolve, reject) => {
//   connection.query(query, (err, rows, fields) => {
//     connection.end();
//     if (err) {
//       reject(err.message);
//     } else {
//       resolve(rows);
//     }
//   })
// })

