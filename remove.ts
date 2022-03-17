import { Request, Response } from 'express';
import { Identity } from '../../models/identity';

import { cognitoidentityserviceprovider, poolData } from './aws-config';

export default async (req: Request, res: Response) => {
  const params = {
    UserPoolId: poolData.UserPoolId,
    Username: req.body.email,
  };

  await new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.adminDeleteUser(params, async function(
      err,
      data
    ) {
      if (err) {
        res.status(400).json({
          error: true,
          data: err,
        });
        console.log(err, err.stack);
        reject(err); // an error occurred
      } else {
        let user = await Identity.findOne({
          where: { email: params.Username },
        });

        if (!user) {
          const resp = {
            error: true,
            data: {
              message: 'Could not find user with the email',
            },
          };
          res.status(400).json();
          return resolve({ statusCode: 400, response: resp });
        } else {
          user.destroy();
          res.status(200).json({
            error: false,
            data: {
              message: 'Successfully deleted user with ' + params.Username,
            },
          });
          return resolve({ statusCode: 200, response: data });
        }
      } // successful response
    });
  });
};
