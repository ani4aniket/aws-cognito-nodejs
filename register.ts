import { Request, Response } from 'express';
import {
  getCognitoAttributeList,
  getUserPool,
  setCognitoAttributeList,
} from './aws-config';

/**
 * @swagger
 *
 * /identity/register:
 *   post:
 *     description: Register
 *     security:
 *      -  [{}]
 *     tags:
 *     - Identity
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: boolean
 *                data:
 *                  $ref: "#/components/schemas/User"
 */
export default async (req: Request, res: Response) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  await new Promise(resolve => {
    setCognitoAttributeList(user.email, 'none');
    getUserPool().signUp(
      user.email,
      user.password,
      getCognitoAttributeList(),
      [],
      (err: any, result: any) => {
        if (err) {
          res.status(400).json({
            error: true,
            data: err,
          });
          return resolve({ statusCode: 400, response: err });
        }
        const response = {
          username: result.user.username,
          userConfirmed: result.userConfirmed,
        };
        res.status(200).json({
          error: false,
          data: response,
        });
        return resolve({ statusCode: 200, response: response });
      }
    );
  });
};
