export interface IJWTPayloadWithUserData {
  id: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}
