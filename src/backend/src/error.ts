// TODO: Verificar a necessidade de adicionar código aos errors
export class ClientError extends Error {
  code: number;

  constructor(message: string, code = 400) {
    super(message);
    Object.setPrototypeOf(this, ClientError.prototype);
    this.name = "ClientError";
    this.code = code;
  }
}
