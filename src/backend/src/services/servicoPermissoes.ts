import type { Permissoes } from "../db/enums/permissoes";
import type { InsertPermissoesSchema } from "../db/schema/permissoes";
import { ClientError, ServerError } from "../error";
import repositorioPermissoes from "../repository/repositorioPermissoes";
import repositorioUsuarios from "../repository/repositorioUsuarios";

class ServicoPermissoes {
  async inserir(perms: InsertPermissoesSchema): Promise<boolean> {
    const atualizacoes = await repositorioPermissoes.inserir(perms);
    return atualizacoes > 0;
  }

  async consultar(usuarioId: string, perms: Permissoes): Promise<boolean> {
    const res = await repositorioPermissoes.selecionar(usuarioId, perms);
    return res.length !== 0;
  }

  async selecionarPermissoes(usuarioId: string): Promise<Permissoes[]> {
    const registros =
      await repositorioPermissoes.selecionarPorIdUsuario(usuarioId);
    return registros.map((p) => p.cargo);
  }

  async adicionarPermissoesUsuario(
    usuarioId: string,
    ...perms: Permissoes[]
  ): Promise<boolean> {
    const regUsuario = await repositorioUsuarios.selecionarPorId(usuarioId);
    if (regUsuario) {
      const valores = perms.map((c) => ({
        usuarioId: usuarioId,
        cargo: c,
      }));
      const atualizacoes = await repositorioPermissoes.inserir(...valores);
      if (atualizacoes > 0) {
        return true;
      } else {
        throw new ServerError(
          "Não foi possível alterar as permissões do usuário.",
        );
      }
    } else {
      return false;
    }
  }

  // TODO: Verificar se usuário existe
  // TODO: Evitar transactions
  async removerPermissoesUsuario(
    usuarioId: string,
    ...perms: Permissoes[]
  ): Promise<boolean> {
    const regUsuario = await repositorioUsuarios.selecionarPorId(usuarioId);
    if (regUsuario) {
      let atualizacoes = 0;
      for (let i = 0; i < perms.length; i++) {
        atualizacoes += await repositorioPermissoes.excluir(
          usuarioId,
          perms[i]!,
        );
      }
      return atualizacoes > 0;
    } else {
      return false;
    }
  }

  async definirPermissoesUsuario(
    usuarioId: string,
    ...perms: Permissoes[]
  ): Promise<boolean> {
    await repositorioPermissoes.utilizarTransacao(async (tx) => {
      const regUsuario = await repositorioUsuarios.selecionarPorId(usuarioId);
      if (regUsuario) {
        await repositorioPermissoes.excluirPermissoesTransacao(tx, usuarioId);
        const valores = perms.map((c) => ({
          usuarioId: usuarioId,
          cargo: c,
        }));
        const atualizacoes = await repositorioPermissoes.inserir(...valores);
        if (atualizacoes > 0) {
          return true;
        } else {
          throw new ServerError(
            "Houve um erro ao alterar as permissões do usuário.",
          );
        }
      } else {
        throw new ClientError("Usuário não encontrado.", 404);
      }
    });

    await this.adicionarPermissoesUsuario(usuarioId, ...perms);
    // TODO: Utilizar Transaction unica
    return true;
  }
}

const servicoPermissoes = new ServicoPermissoes();

export default servicoPermissoes;
