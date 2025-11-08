import type {
  InsertPermissoesSchema,
  Permissoes,
} from "../db/schema/permissoes";
import { RepositorioPermissoes } from "../repository/repositorioPermissoes";

const repositorioPermissoes = new RepositorioPermissoes();

export class ServicoPermissoes {
  inserir(perms: InsertPermissoesSchema) {
    return repositorioPermissoes.inserir(perms);
  }

  async consultar(usuarioId: string, perms: Permissoes): Promise<boolean> {
    const res = await repositorioPermissoes.selecionar(usuarioId, perms);
    return res.length !== 0;
  }

  async selecionarPermissoes(usuarioId: string): Promise<Permissoes[]> {
    const res =
      await repositorioPermissoes.selecionarPersmissoesPorIdUsuario(usuarioId);
    const perms: Permissoes[] = res.map((p) => p.cargo);
    return perms;
  }
}

const servicoPermissoes = new ServicoPermissoes();

export default servicoPermissoes;
