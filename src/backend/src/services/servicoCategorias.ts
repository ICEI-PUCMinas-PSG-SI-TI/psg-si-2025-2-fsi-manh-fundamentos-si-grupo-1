import { ServerError } from "../error";
import repositorioCategorias from "../repository/repositorioCategorias";
import * as z4 from "zod/v4";

export const SetCategoriaDtoZ = z4.strictObject({
  nome: z4.string().min(1).max(128),
});

export type SetCategoriaDTO = z4.infer<typeof SetCategoriaDtoZ>;

export const GetCategoriaDtoZ = z4.strictObject({
  id: z4.uuid(),
  nome: z4.string().min(1).max(128),
});

export type GetCategoriaDTO = z4.infer<typeof GetCategoriaDtoZ>;

class ServicoCategorias {
  // TODO: Verificar se nome já existe (Testar Upper/Lowercase)
  async inserir(categoria: SetCategoriaDTO): Promise<string> {
    const res = await repositorioCategorias.inserir({
      nome: categoria.nome,
    });
    if (!res[0]) {
      throw new ServerError("Não foi possível criar categoria.");
    } else {
      return res[0].id;
    }
  }

  async selecionarPorId(id: string): Promise<GetCategoriaDTO | null> {
    const registro = await repositorioCategorias.selecionarPorId(id);
    if (registro) {
      return {
        id: registro.id,
        nome: registro.nome,
      };
    } else {
      return null;
    }
  }

  async selecionarTodos(): Promise<GetCategoriaDTO[]> {
    const registros = await repositorioCategorias.selecionarTodos();
    return registros.map((registro) => ({
      id: registro.id,
      nome: registro.nome,
    }));
  }

  // TODO: validar UUID
  async excluirPorId(id: string): Promise<boolean> {
    const registro = await repositorioCategorias.selecionarPorId(id);
    if (registro) {
      const atualizacoes = await repositorioCategorias.excluirPorId(id);
      if (atualizacoes > 0) {
        return true;
      } else {
        throw new ServerError("Não foi possível excluir a categoria.");
      }
    } else {
      return false;
    }
  }

  async contar(): Promise<number> {
    const res = await repositorioCategorias.contar();
    return res!.count;
  }
}

const servicoCategorias = new ServicoCategorias();

export default servicoCategorias;
