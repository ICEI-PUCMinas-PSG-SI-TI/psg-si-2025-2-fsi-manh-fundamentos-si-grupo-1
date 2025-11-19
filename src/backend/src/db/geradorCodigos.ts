import servicoConfiguracoes from "../services/servicoConfiguracoes";
import { Identificador } from "./enums/identificador";
import { customAlphabet } from "nanoid";

const config = await servicoConfiguracoes.selecionar();

function creteNanoId(identificador: Identificador): (size?: number) => string {
  let alphabet: string, size: number;
  switch (identificador) {
    case Identificador.Hexadecimal:
      alphabet = "0123456789ABCDEF";
      size = 7;
      break;
    case Identificador.Numero:
      alphabet = "0123456789";
      size = 10;
      break;
    default:
      // or Identificador.Seguro:
      alphabet = "6789BCDFGHJKMNPQRTW";
      size = 6;
      break;
  }
  return customAlphabet(alphabet, size);
}

// Gerador de IDs
export let geradorCodigo = creteNanoId(
  config?.identificador || Identificador.Seguro,
);

export function configurarGerador(identificador: Identificador): void {
  geradorCodigo = creteNanoId(identificador);
}
