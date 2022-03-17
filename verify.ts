import { Request, Response } from 'express';
import { getCognitoUser } from './aws-config';

export default async (req: Request, res: Response) => {
  const user = {
    email: req.body.email,
    code: req.body.code,
  };

  await new Promise(resolve => {
    getCognitoUser(user.email).confirmRegistration(
      user.code,
      true,
      (err, result) => {
        if (err) {
          res.status(400).json({
            error: true,
            data: err,
          });
          return resolve({ statusCode: 400, response: err });
        }
        res.status(200).json({
          error: false,
          data: result,
        });
        return resolve({ statusCode: 200, response: result });
      }
    );
  });
};
