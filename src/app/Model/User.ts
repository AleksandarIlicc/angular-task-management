export class User {
  constructor(
    public fullname: string,
    public email: string,
    public id: string,
    private _token: string,
    private _expiresIn: Date
  ) {}
  get token() {
    if (!this._expiresIn || this._expiresIn < new Date()) {
      return null;
    }
    return this._token;
  }
}

export interface UserReponse {
  fullname: string;
  email: string;
  id: string;
}
