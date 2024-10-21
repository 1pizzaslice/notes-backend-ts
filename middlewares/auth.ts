

import { Request, Response, NextFunction } from 'express';
import { getUser } from '../service/auth';

interface IUser {
  _id: string;
  isAdmin: boolean;
  [key: string]: any;  // For other properties that may exist on the user object
}

interface IAuthRequest extends Request {
  user?: IUser;
}

async function restrictToLoggedinUserOnly(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
  const userUid = req.cookies?.uid;

  if (!userUid) {
   res.json({ message: 'User not logged in' });
   return;
  }

  const user = getUser(userUid);

  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  req.user = user;
  next();
}

async function checkAuth(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
  const userUid = req.cookies?.uid;
  const user = getUser(userUid);
  req.user = user;
  next();
}


export { restrictToLoggedinUserOnly, checkAuth };
