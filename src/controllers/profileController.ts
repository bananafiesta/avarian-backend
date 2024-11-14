import { NextFunction, Request, Response } from "express";
import { economy_obj, getXconomy } from "../services/xconomy";

interface AuthenticatedRequest extends Request {
  user?: user_obj
}
interface user_obj {
  sub?: string
}

export async function getWallet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const uuid: string = req.user.sub;
    const wallet: economy_obj[] = await getXconomy(uuid);
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: 'Error getting wallet'});
  }
}