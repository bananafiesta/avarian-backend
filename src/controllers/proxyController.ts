import { NextFunction, Request, Response } from "express";
import { fetchUsername } from "../services/proxy";

export async function getMCUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const uuid = req.params.uuid;
    if (!uuid) {
      throw new Error('No uuid found')
    }
    const username = await fetchUsername(uuid);
    res.status(200).json({username: username});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: error});
  }
}