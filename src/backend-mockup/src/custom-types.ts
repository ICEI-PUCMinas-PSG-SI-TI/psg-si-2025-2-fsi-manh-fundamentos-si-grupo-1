import { faker, fakerPT_BR } from "@faker-js/faker";

/** $gemini
 * Generates a random, but valid, Brazilian CPF number.
 *
 * The CPF (Cadastro de Pessoas Físicas) is the Brazilian
 * individual taxpayer registry ID. This function generates a number
 * with valid check digits and avoids common invalid patterns.
 *
 * @param {boolean} [formatted=false] - If true, returns the formatted CPF (e.g., "XXX.XXX.XXX-XX").
 * @returns {string} An 11-digit string representing a valid CPF, with or without formatting.
 */
/**
 * Generates a random, but valid, Brazilian CPF number.
 *
 * The CPF (Cadastro de Pessoas Físicas) is the Brazilian
 * individual taxpayer registry ID. This function generates a number
 * with valid check digits and avoids common invalid patterns.
 *
 * @param {boolean} [formatted=false] - If true, returns the formatted CPF (e.g., "XXX.XXX.XXX-XX").
 * @returns {string} An 11-digit string representing a valid CPF, with or without formatting.
 */
export function fakerCPF(formatted: boolean = false): string {
  let baseDigits: number[];

  // Generate base digits and ensure they are not all the same (e.g., 111.111.111)
  do {
    baseDigits = Array.from({ length: 9 }, () =>
      Math.floor(Math.random() * 10)
    );
  } while (new Set(baseDigits).size === 1);

  /**
   * Helper to calculate a CPF check digit.
   * @param {number[]} digits - The array of numbers to calculate the digit from.
   * @returns {number} The calculated check digit.
   */
  const calculateDigit = (digits: number[]): number => {
    const weight: number = digits.length + 1;
    const sum: number = digits.reduce(
      (acc, digit, i) => acc + digit * (weight - i),
      0
    );
    const remainder: number = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Calculate the first check digit
  const dv1: number = calculateDigit(baseDigits);
  const first10: number[] = [...baseDigits, dv1];

  // Calculate the second check digit
  const dv2: number = calculateDigit(first10);

  const cpf: string = [...first10, dv2].join("");

  if (formatted) {
    // Apply the format XXX.XXX.XXX-XX using a regular expression
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return cpf;
}

/** $gemini
 * Generates a random, but valid, Brazilian CNPJ number.
 *
 * The CNPJ (Cadastro Nacional da Pessoa Jurídica) is the Brazilian
 * corporate taxpayer registry ID. This function generates a number
 * with valid check digits.
 *
 * @param {boolean} [formatted=false] - If true, returns the formatted CNPJ (e.g., "XX.XXX.XXX/XXXX-XX").
 * @returns {string} A 14-digit string representing a valid CNPJ, with or without formatting.
 */
export function fakerCNPJ(formatted: boolean = false): string {
  const base: number[] = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10)
  );
  const branch: number[] = [0, 0, 0, 1]; // Represents the main branch ('matriz')
  const first12: number[] = [...base, ...branch];

  /**
   * Calculates a CNPJ check digit.
   * @param {number[]} digits - The base numbers to calculate from.
   * @param {number[]} weights - The weights to apply in the calculation.
   * @returns {number} The calculated check digit.
   */
  const calculateDigit = (digits: number[], weights: number[]): number => {
    const sum: number = digits.reduce((acc, digit, i) => {
      if (!weights[i]) weights[i] = 1;
      return acc + digit * weights[i];
    }, 0);
    const remainder: number = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Define the weights for each check digit calculation
  const weights1: number[] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  // Calculate the first check digit
  const dv1: number = calculateDigit(first12, weights1);
  const first13: number[] = [...first12, dv1];

  // Calculate the second check digit
  const dv2: number = calculateDigit(first13, weights2);

  const cnpj: string = [...first13, dv2].join("");

  if (formatted) {
    // Apply the format XX.XXX.XXX/XXXX-XX
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  return cnpj;
}

export function fakerEndereco() {
  return [
    fakerPT_BR.location.street(),
    " ",
    faker.location.buildingNumber(),
    " - ",
    fakerPT_BR.location.city(),
    ", ",
    fakerPT_BR.location.state(),
  ].join("");
}

export function fakerLote() {
  return faker.string.alphanumeric({ casing: "upper", length: 12 });
}

export function fakerDimensoes() {
  return [
    faker.number.int({ min: 1, max: 100 }),
    "cm x ",
    faker.number.int({ min: 1, max: 100 }),
    "cm x ",
    faker.number.int({ min: 1, max: 100 }),
    "cm",
  ].join("");
}

export function fakerLocal() {
  return `Andar ${faker.number.int({ min: 1, max: 10 })}`;
}

export function fakerImageURL() {
  return `https://picsum.photos/seed/${faker.number.int({
    min: 1,
    max: 1000,
  })}/200/300`;
}

export function fakerIntBoolean() {
  return faker.number.int({ min: 0, max: 1 });
}
