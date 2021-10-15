declare global {
  type ClientTokenResponse = {
    clientToken: string;
  };

  type AuthTokenResponse = {
    authorization_token: string;
  };
  type AuthResult = {
    order_id: string;
  };
}

export {};
