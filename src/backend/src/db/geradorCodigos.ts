// import servicoConfiguracoes from "../services/servicoConfiguracoes";
import { customAlphabet } from "nanoid";
import {
  Identificador,
  alfabetoHexadecimal,
  alfabetoNumerico,
  alfabetoSeguro,
} from "./enums/identificador";

// const config = await servicoConfiguracoes.selecionar();

const config = {
  identificador: Identificador.Seguro,
};

function creteNanoId(identificador: Identificador): (size?: number) => string {
  let alphabet: string, size: number;
  switch (identificador) {
    case Identificador.Hexadecimal:
      alphabet = alfabetoHexadecimal;
      size = 7;
      break;
    case Identificador.Numerico:
      alphabet = alfabetoNumerico;
      size = 10;
      break;
    default:
      // or Identificador.Seguro:
      alphabet = alfabetoSeguro;
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
