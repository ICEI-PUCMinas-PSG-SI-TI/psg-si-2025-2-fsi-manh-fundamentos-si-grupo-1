import type { InsertLote, SelectLote, UpdateLote } from "../db/schema";
import { debug } from "../logging";
import { RepositorioLotes } from "../repository/RepositorioLotes";
import { stringify as stringifyUUID } from "uuid";

// JSON: primitive only
export type LoteQueryOptions = {
  page?: number;
  pageSize?: number;
  validade?: {
    min: string;
    max: string;
  };
  quantidade?: {
    min: number;
    max: number;
  };
  lote?: string;
};

function updateUUID(result: SelectLote[]) {
  result.forEach((value, index, array) => {
    if (!array[index]) return;
    array[index].id = stringifyUUID(parseUuid(value.id));
    array[index].produto_id = stringifyUUID(parseUuid(value.produto_id));
  });
  return result;
}

const repositorioLotes = new RepositorioLotes();

export class LoteService {
  async inserir(lote: InsertLote) {
    repositorioLotes.inserir(lote).then((res) => {
      if (res && res > 0) {
        debug(`Novo lote criado!`, { label: "LoteService" });
      }
    });
  }

  async selecionarPorId(id: Uint8Array) {
    return repositorioLotes
      .selecionarPorId(id)
      .then(updateUUID)
      .then((res) => {
        let strId = stringifyUUID(id);
        debug(`Retornando lote ${strId}`, { label: "LoteService" });
        return res;
      });
  }

  async selecionarConsulta(opts?: LoteQueryOptions) {
    let query = repositorioLotes.selecionarQuery();
    if (opts) {
      if (typeof opts.lote === "string") {
        query = query.comLote(opts.lote);
      }
      if (opts.page || opts.pageSize) {
        query = query.comPaginacao(opts.page, opts.pageSize);
      }
      if (opts.quantidade) {
        query = query.comQuantidade(opts.quantidade.min, opts.quantidade.max);
      }
      if (opts.validade) {
        const MAX_DATE = 8640000000000000;
        const valMin = new Date(opts.validade.min ? opts.validade.min : 0);
        const valMax = new Date(
          opts.validade.max ? opts.validade.max : MAX_DATE
        );
        // TODO: Validar datas
        query = query.comValidadeEntre(valMin, valMax);
      }
    }

    return query
      .executarConsulta()
      .then(updateUUID)
      .then((result) => {
        debug(`Retornando lotes selecionados`, { label: "LoteService" });
        return result;
      });
  }

  async selecionarTodos() {
    return repositorioLotes
      .selecionarTodos()
      .then(updateUUID)
      .then((result) => {
        debug(`Retornando lotes`, { label: "LoteService" });
        return result;
      });
  }

  async atualizar(id: Uint8Array, lote: UpdateLote) {
    return repositorioLotes.atualizarPorId(id, lote).then((result) => {
      let strId = stringifyUUID(id);
      debug(`Informações do lote ${strId} atualizadas!`, {
        label: "LoteService",
      });
      return result;
    });
  }

  async excluir(id: Uint8Array) {
    return repositorioLotes.excluirPorId(id).then((result) => {
      let strId = stringifyUUID(id);
      debug(`Informações do lote ${strId} excluidas!`, {
        label: "LoteService",
      });
      return result;
    });
  }
}

function parseUuid(id: unknown): Uint8Array<ArrayBufferLike> {
  if (id instanceof Uint8Array) {
    return id;
  } else if (id instanceof ArrayBuffer) {
    return new Uint8Array(id);
  } else {
    throw new Error("Not a valid UUID");
  }
}
