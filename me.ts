import { Request, Response } from 'express';

import { Company } from '../../models/company';
import { IUser } from '.';

/**
 * @swagger
 *
 * /identity/me:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     description: Get information about the current user
 *     tags:
 *     - Identity
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
  const company = await Company.findByPk((req.user as IUser).companyId);
  res.send({
    error: false,
    data: {
      ...req.user,
      companies: [company],
      timezone: company!.timezone, //TODO: move timezone to user? (analyze)
    },
  });
};
