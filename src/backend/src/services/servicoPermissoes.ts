import type { Permissoes } from "../db/enums/permissoes";
import type { InsertPermissoesSchema } from "../db/schema/permissoes";
import { RepositorioPermissoes } from "../repository/repositorioPermissoes";

const repositorioPermissoes = new RepositorioPermissoes();

export class ServicoPermissoes {
  async inserir(perms: InsertPermissoesSchema): Promise<boolean> {
    const atualizacoes = await repositorioPermissoes.inserir(perms);
    return atualizacoes > 0;
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
  async adicionarPermissoesUsuario(
    usuarioId: string,
    ...perms: Permissoes[]
  ): Promise<boolean> {
    const valores = perms.map((c) => ({
      usuarioId: usuarioId,
      cargo: c,
    }));
    const atualizacoes = await repositorioPermissoes.inserir(...valores);
    return atualizacoes > 0;
  }

  // TODO: Verificar se usuário existe
  // TODO: Evitar transactions
  async removerPermissoesUsuario(
    usuarioId: string,
    ...perms: Permissoes[]
  ): Promise<boolean> {
    let atualizacoes = 0;
    for (let i = 0; i < perms.length; i++) {
      atualizacoes += await repositorioPermissoes.excluir(usuarioId, perms[i]!);
    }
    return atualizacoes > 0;
  }

  async removerPermissoesUsuario2(
    usuarioId: string,
    ...perms: Permissoes[]
  ): Promise<boolean> {
    let atualizacoes = 0;

    for (let i = 0; i < perms.length; i++) {
      atualizacoes += await repositorioPermissoes.excluir(usuarioId, perms[i]!);
    }
    return atualizacoes > 0;
  }

  async removerTodasPermissoes(usuarioId: string): Promise<boolean> {
    const atualizacoes =
      await repositorioPermissoes.excluirPermissoes(usuarioId);
    return atualizacoes > 0;
  }
}

const servicoPermissoes = new ServicoPermissoes();

export default servicoPermissoes;
