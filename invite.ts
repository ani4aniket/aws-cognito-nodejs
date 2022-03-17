import { Request, Response } from 'express';
import { cognitoidentityserviceprovider, poolData } from './aws-config';

export default async (req: Request, res: Response) => {
  const params = {
    UserPoolId: poolData.UserPoolId,
    Username: req.body.email,
    DesiredDeliveryMediums: ['EMAIL'],
    ForceAliasCreation: false,
    UserAttributes: [
      {
        Name: 'email',
        Value: req.body.email,
      },
      {
        Name: 'email_verified',
        Value: 'True',
      },
      {
        Name: 'custom:role',
        Value: req.body.role,
      },
      {
        Name: 'custom:companyId',
        Value: req.body.companyId,
      },
    ],
  };

  await new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.adminCreateUser(params, function(err, data) {
      if (err) {
        res.status(400).json({
          error: true,
          data: err,
        });
        console.log(err, err.stack);
        reject(err); // an error occurred
      } else {
        const params = {
          GroupName: req.body.role,
          UserPoolId: poolData.UserPoolId,
          Username: req.body.email,
        };

        cognitoidentityserviceprovider.adminAddUserToGroup(
          params,
          (err, newData) => {
            if (err) {
              res.status(400).json({
                error: true,
                data: err,
              });
              return resolve({ statusCode: 400, response: err });
            }
            res.status(200).json({
              error: false,
              data: data,
            });
            return resolve({ statusCode: 200, response: data });
          }
        );
      } // successful response
    });
  });
};
