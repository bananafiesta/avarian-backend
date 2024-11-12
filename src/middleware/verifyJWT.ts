const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function decodeJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({error: 'Token missing'});
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
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