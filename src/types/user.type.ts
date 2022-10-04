export type LoginParams = {
  username: string;
  password: string;
};

export type UserPublicData = {
  username: string;
  fullname: string;
  rights: string;
  sessionId: string;
};

export type UserPrivateData = {
  username: string;
  password: string;
};

export type User = Omit<UserPublicData, 'sessionId'> & UserPrivateData;
