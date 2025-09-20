export interface ICheckOutResponse {
  status: string;
  session: {
    url: string;
    success_url: string;
    cancel_url: string;
  };
}
