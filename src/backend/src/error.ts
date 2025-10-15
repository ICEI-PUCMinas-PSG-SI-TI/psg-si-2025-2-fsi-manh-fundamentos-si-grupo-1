// TODO: Verificar a necessidade de adicionar código aos errors
export class ClientError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ClientError.prototype);
    this.name = "ClientError";
  }
}
