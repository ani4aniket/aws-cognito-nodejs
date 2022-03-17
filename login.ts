import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../../models';
import { getAuthDetails, getCognitoUser } from './aws-config';

/**
 * @swagger
 *
 * /identity/login:
 *   post:
 *     description: Login
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
 *                  $ref: "#/components/schemas/UserWithJwt"
 */
export default async (req: Request, res: Response) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  await new Promise<void>((resolve, reject) => {
    getCognitoUser(user.email).authenticateUser(
      getAuthDetails(user.email, user.password),
      {
        onSuccess: async result => {
          const cognitoUsername = result.getAccessToken().payload.username;
          const token = {
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          };

          const { exp } = (jwt.decode(token.accessToken) as any) as {
            exp: string;
          };

          const data: any = await sequelize.query(
            `
            SELECT Idt.id, Idt.email, Idt.role, Idt.companyId, Idt.firstName, Idt.lastName
            FROM Identities Idt
            INNER JOIN Companies C on Idt.companyId = C.id
            WHERE Idt.cognitoUsername=$cognitoUsername`,
            { type: QueryTypes.SELECT, bind: { cognitoUsername } }
          );
          const user = {
            email: data[0].email,
            companyId: data[0].companyId,
            id: data[0].id,
            role: data[0].role,
          };

          res.json({
            error: false,
            data: {
              ...user,
              jwt: {
                token: token.accessToken,
                exp,
              },
            },
          });

          return;
        },

        onFailure: err => {
          res.json({
            error: true,
            message: err.message,
          });
          return;
        },
      }
    );
  });
};
