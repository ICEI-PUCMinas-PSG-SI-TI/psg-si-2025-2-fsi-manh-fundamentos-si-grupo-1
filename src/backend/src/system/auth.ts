import { hash } from "bcrypt";

// Parte do código utilizado neste arquivo foi adaptado de https://lucia-auth.com para fins de aprendizado.

const bcryptRounds = process.env.BCRYPT_ROUNDS || "10";
const rounds = parseInt(bcryptRounds, 10);

export function hashSenha(senha: string): Promise<string> {
  return hash(senha, rounds);
}

export async function hashSecret(secret: string): Promise<Uint8Array> {
  const secretBytes = new TextEncoder().encode(secret);
  const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
  return new Uint8Array(secretHashBuffer);
}

export function generateSecureRandomString(): string {
  // Human readable alphabet (a-z, 0-9)
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const alphabetLenght = alphabet.length;
  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  let id = "";
  for (let i = 0; i < bytes.length; i++) {
    id += alphabet[bytes[i]! % alphabetLenght];
  }
  return id;
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  let c = 0;
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i]! ^ b[i]!;
  }
  return c === 0;
}
