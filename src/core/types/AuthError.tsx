export type AuthError = {
  error: {
    code: number;
    message: string;
  };
};

export type ValidateError = {
  name: string;
  message: string;
};
