import { Request, Response } from 'express';
import { cognitoidentityserviceprovider, poolData } from './aws-config';
import bcrypt from 'bcryptjs';
import { Identity } from '../../models/identity';

export default async (req: Request, res: Response) => {
  const params = {
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    ClientId: poolData.ClientId,
    UserPoolId: poolData.UserPoolId,
    AuthParameters: {
      USERNAME: req.body.email,
      PASSWORD: req.body.password,
    },
  };

  await new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.adminInitiateAuth(params, function(
      err,
      userData
    ) {
      if (err) {
        res.status(400).json({
          error: true,
          data: err,
        });
        console.log(err, err.stack);
        reject(err); // an error occurred
      } else {
        const params = {
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          ClientId: poolData.ClientId,
          ChallengeResponses: {
            USERNAME: req.body.email,
            NEW_PASSWORD: req.body.newPassword,
          },
          Session: userData.Session,
        };

        cognitoidentityserviceprovider.respondToAuthChallenge(
          params,
          async function(err, data) {
            if (err) {
              console.log(err, err.stack);
              res.status(400).json({
                error: true,
                data: err,
              });
            }

            // an error occurred
            else {
              const userInfoCog = JSON.parse(
                userData.ChallengeParameters!.userAttributes
              );

              const user = await Identity.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: await bcrypt.hash(req.body.newPassword, 10),
                companyId: userInfoCog['custom:companyId'],
                role: userInfoCog['custom:role'],
                cognitoUsername: userData.ChallengeParameters![
                  'USER_ID_FOR_SRP'
                ],
              });
              res.status(200).json({
                error: false,
                data: userInfoCog,
              }); // successful response
            }
          }
        );
        // console.log(data);

        resolve(userData);
      } // successful response
    });
  });
};
