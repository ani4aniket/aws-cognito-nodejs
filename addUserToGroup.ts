import { Request, Response } from 'express';
import { cognitoidentityserviceprovider, poolData } from './aws-config';

export default async (req: Request, res: Response) => {
  const params = {
    GroupName: req.body.groupName,
    UserPoolId: poolData.UserPoolId,
    Username: req.body.username,
  };

  await new Promise(resolve => {
    cognitoidentityserviceprovider.adminAddUserToGroup(params, (err, data) => {
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
    });
  });
};
