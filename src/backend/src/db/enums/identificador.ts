// TODO: Utilizar nanoid
// Números (0123456789)
// Hexadecimal (0123456789ABCDEFG)
// Seguro (6789BCDFGHJKMNPQRTW)

export enum Identificador {
  // 0123456789
  Numerico = "NUM",
  // 0123456789ABCDEFG
  Hexadecimal = "HEX",
  // 6789BCDFGHJKMNPQRTW
  Seguro = "SEG",
}

export const alfabetoNumerico = "0123456789";
export const alfabetoHexadecimal = "0123456789ABCDEF";
export const alfabetoSeguro = "6789BCDFGHJKMNPQRTW";
