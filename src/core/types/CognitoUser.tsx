export type CognitoUser = {
  cognitoId: string;
  name: string;
  nickname: string;
  email: string;
  gender: string;
  birthdate: string;
  createdOn: Date;
  picture?: string;
};
