import { Company } from './../../models/company';
import { Request, Response } from 'express';
import { Identity } from '../../models/identity';

import { cognitoidentityserviceprovider, poolData } from './aws-config';

export default async (req: Request, res: Response) => {
  await new Promise(async (resolve, reject) => {
    const cognitoUsers = await getAllUsers('');
    const users = await Identity.findAll({
      raw: true,
      attributes: {
        exclude: [
          'password',
          'companyId',
          'createdAt',
          'updatedAt',
          'id',
          'CompanyId',
          'email',
        ],
      },
      include: { model: Company, attributes: ['name'], required: true },
    });

    const data = cognitoUsers!.map(itm => ({
      ...users.find(item => item.cognitoUsername === itm.Username && item),
      ...{
        userStatus: itm.UserStatus,
        email: itm.Attributes.find(y => y.Name === 'email').Value,
      },
    }));

    res.status(200).json({ length: data.length, data });

    return resolve({ statusCode: 200, response: 'data' });
  });
};

const getAllUsers = async paginationToken => {
  let nextToken = paginationToken;
  let usersArr: any = [];
  while (nextToken !== undefined) {
    const params = {
      UserPoolId: poolData.UserPoolId,
      ...(nextToken !== '' && { PaginationToken: nextToken }),
    };
    const response = await cognitoidentityserviceprovider
      .listUsers(params)
      .promise();
    usersArr = usersArr.concat(response.Users);
    nextToken = response.PaginationToken;
  }

  return usersArr;
};
