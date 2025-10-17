export function parseUuidBuffer(
  id: Uint8Array | ArrayBuffer | unknown
): Uint8Array<ArrayBufferLike> {
  let uuid: Uint8Array;
  if (id instanceof Uint8Array) {
    uuid = id;
  } else if (id instanceof ArrayBuffer) {
    uuid = new Uint8Array(id);
  } else {
    throw new Error("Not a valid UUID");
  }
  return uuid;
}
