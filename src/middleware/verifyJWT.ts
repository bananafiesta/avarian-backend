import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function decodeJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string = "";
  if (authHeader) {
    // token = authHeader.split(' ')[1];
    const tokens = authHeader.split(' ');
    if (tokens.length >= 2) {
      token = tokens[1];
    }
  }
  if (!token) {
    res.status(401).json({error: 'Token missing'});
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

// export async function verifyUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
//   try {
//     const userId = req.user?.sub;

//     if (!userId) {
//       res.status(400).json({ error: 'User ID missing from request' });
//     }
//     const {data, error} = await supabase.schema('public').from('users').select('id').eq('id', userId);
//     if (error) {
//       res.status(500).json({ error: error.message });
//     }

//     if (data) {
      
//     } else {
      
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'Server error' });
//   }
// }