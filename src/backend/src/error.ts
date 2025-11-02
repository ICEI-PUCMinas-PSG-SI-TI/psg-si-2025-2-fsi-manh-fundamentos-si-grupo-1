// TODO: Extend HttpError
export class ClientError extends Error {
  code: number;

  constructor(message: string, code = 400) {
    super(message);
    Object.setPrototypeOf(this, ClientError.prototype);
    this.name = "ClientError";
    this.code = code;
  }
}

export class HttpError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
    this.name = "HttpError";
    this.code = code;
  }
}
