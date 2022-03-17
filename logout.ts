import { Request, Response } from 'express';

/**
 * @swagger
 *
 * /identity/logout:
 *   post:
 *     description: Logout
 *     security:
 *      -  [{}]
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
 */
export default (req: Request, res: Response) => {
  // TODO: this doesn't actually do anything because
  // JWTs are stateless. Remove this endpoint.
  req.logout();
  res.send({
    error: false,
  });
};
