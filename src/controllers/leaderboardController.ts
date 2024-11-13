import { NextFunction, Request, Response } from "express";
import { fetchLeaderboard } from "../services/leaderboard";


export async function getLeaderboard(req: Request, res: Response, next: NextFunction) {
  
  try {
    const leaderboard = await fetchLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error})
  }
}