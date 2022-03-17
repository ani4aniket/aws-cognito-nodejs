import { Request, Response } from 'express';
import { cognitoidentityserviceprovider, poolData } from './aws-config';

export default async (req: Request, res: Response) => {
  await new Promise(async (resolve, reject) => {
    const params = {
      UserPoolId: poolData.UserPoolId,
      Username: req.body.email,
      Permanent: true,
      Password: req.body.password,
    };

    const data = await cognitoidentityserviceprovider
      .adminSetUserPassword(params)
      .promise();

    res.status(200).json({
      error: false,
      data: data,
    });
    return resolve({ statusCode: 200, response: 'data' });
  });
};
