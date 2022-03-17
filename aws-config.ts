import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

let cognitoAttributeList: any = [];

const poolData = {
  UserPoolId: 'us-west-2_FQpfdm0QF', // Your user pool id here
  ClientId: '4ohfiba07k15uedtmi3g3vutc', // Your client id here
};

AWS.config.region = 'us-west-2';
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

const attributes = (key, value) => {
  return {
    Name: key,
    Value: value,
  };
};

function setCognitoAttributeList(email, agent) {
  let attributeList: any = [];
  attributeList.push(attributes('email', email));
  attributeList.forEach(element => {
    cognitoAttributeList.push(new CognitoUserAttribute(element));
  });
}

function getCognitoAttributeList() {
  return cognitoAttributeList;
}

function getCognitoUser(email) {
  const userData = {
    Username: email,
    Pool: getUserPool(),
  };
  return new CognitoUser(userData);
}

function getUserPool() {
  return new CognitoUserPool(poolData);
}

function getAuthDetails(email, password) {
  const authenticationData = {
    Username: email,
    Password: password,
  };
  return new AuthenticationDetails(authenticationData);
}

export {
  cognitoidentityserviceprovider,
  poolData,
  getUserPool,
  getCognitoUser,
  getAuthDetails,
  setCognitoAttributeList,
  getCognitoAttributeList,
};
