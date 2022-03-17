import { Router } from 'express';
import { IIdentity } from '../../models/identity';
import isAuthorized from '../auth-middleware';
import addUserToGroup from './addUserToGroup';
import confirmInvite from './confirm-invite';
import invite from './invite';
import login from './login';
import logout from './logout';
import me from './me';
import register from './register';
import remove from './remove';
import verify from './verify';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *      User:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          role:
 *            type: string
 *          company:
 *            type: string
 *      UserWithJwt:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          role:
 *            type: string
 *          company:
 *            type: string
 *          jwt:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *              exp:
 *                type: number
 */

export interface IUser {
  email: string;
  companyId: number;
  id: number;
  role: string;
}

const router = Router();

export const serializeUser = (user: IIdentity): IUser => {
  return {
    email: user.email,
    companyId: user.companyId,
    id: user.id,
    role: user.role,
  };
};

router.post('/invite', isAuthorized, invite);
router.post('/invite/confirm', confirmInvite);

router.post('/register', register);
router.post('/register/verify', verify);
router.post('/register/assign-role', addUserToGroup);

router.post('/login', login);

router.get('/me', isAuthorized, me);
router.post('/remove', isAuthorized, remove);
router.post('/logout', logout);

export const ADMIN_ROLE = 'admin';
export default router;
