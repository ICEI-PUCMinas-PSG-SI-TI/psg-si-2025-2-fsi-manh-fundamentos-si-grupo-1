import type { Permissoes } from "../db/enums/permissoes";
import type { InsertPermissoesSchema } from "../db/schema/permissoes";
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

  // TODO: Verificar se usuário existe
  adicionarPermissoesUsuario(usuarioId: string, ...perms: Permissoes[]) {
    const valores = perms.map((c) => ({
      usuarioId: usuarioId,
      cargo: c,
    }));
    return repositorioPermissoes.inserir(...valores);
  }

  // TODO: Verificar se usuário existe
  async removerPermissoesUsuario(usuarioId: string, ...perms: Permissoes[]) {
    for (let i = 0; i < perms.length; i++) {
      await repositorioPermissoes.excluir(usuarioId, perms[i]!);
    }
  }

  removerTodasPermissoes(usuarioId: string) {
    return repositorioPermissoes.excluirPermissoes(usuarioId);
  }
}

const servicoPermissoes = new ServicoPermissoes();

export default servicoPermissoes;
