import { Request, Response } from 'express';
import { cognitoidentityserviceprovider, poolData } from './aws-config';

export default async (req: Request, res: Response) => {
  const user = {
    email: req.body.email,
  };

  await new Promise(resolve => {
    cognitoidentityserviceprovider.adminConfirmSignUp(
      {
        UserPoolId: poolData.UserPoolId,
        Username: user.email,
      },
      function(err, data) {
        if (err) {
          console.log(err, err.stack);
          return res.status(400).json({
            error: err,
          });
        }
        // an error occurred
        else
          res.status(200).json({
            error: false,
            data: data,
          });
        return resolve({ statusCode: 200, response: data }); // successful response
      }
    );
  });
};
