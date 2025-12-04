import { compare } from "bcrypt";
import * as z4 from "zod/v4";
import { SenhaZ } from "../api/v1/objects";
import { Permissoes } from "../db/enums/permissoes";
import {
  InsertUsuarioSchemaZ,
  UpdateUsuarioSchemaZ,
} from "../db/schema/usuarios";
import { ClientError, ServerError } from "../error";
import { bufferTostring, z4Base64File } from "../helpers";
import { error } from "../logging";
import repositorioUsuarios from "../repository/repositorioUsuarios";
import { hashSenha } from "../system/auth";
import servicoPermissoes from "./servicoPermissoes";

export const SetUsuarioDtoZ = z4.strictObject({
  nome: z4.string().min(1).max(32),
  login: z4.string().min(1).max(32),
  senha: SenhaZ,
  // @Deprecated
  password: SenhaZ,
  descricao: z4.string().max(256).nullable().optional(),
  habilitado: z4.boolean().optional(),
  foto: z4Base64File.nullable().optional(),
});

export type SetUsuarioDto = z4.infer<typeof SetUsuarioDtoZ>;

export type GetUsuarioSimplesDto = {
  id: string;
  nome: string;
  descricao: string | null;
  foto: string | null;
};

export type GetUsuarioDto = GetUsuarioSimplesDto & {
  login: string;
  habilitado: boolean;
  modoEscuro: boolean;
};

export const UpdateUsuarioDtoZ = z4.strictObject({
  nome: z4.string().min(1).max(32).optional(),
  login: z4.string().min(1).max(32).optional(),
  senha: SenhaZ.optional(),
  descricao: z4.string().max(256).nullable().optional(),
  habilitado: z4.boolean().optional(),
  foto: z4Base64File.nullable().optional(),
});

export type UpdateUsuarioDto = z4.infer<typeof UpdateUsuarioDtoZ>;

export const SetPerfilDtoZ = UpdateUsuarioSchemaZ.pick({
  login: true,
  nome: true,
  modoEscuro: true,
  foto: true,
}).strict();

export type SetPerfilDto = z4.infer<typeof SetPerfilDtoZ>;

class ServicoUsuarios {
  async inserir(
    usuario: SetUsuarioDto,
    opts?: {
      cargos?: Permissoes[];
    },
  ): Promise<string> {
    // Verifica se login já existe
    const registro = await repositorioUsuarios.selecionarPorLogin(
      usuario.login,
    );
    if (registro) {
      throw new ClientError("Login já existe.", 409);
    }
    const hashedPassword = await hashSenha(usuario.password);
    const insertUsuario = InsertUsuarioSchemaZ.parse({
      nome: usuario.nome,
      login: usuario.login,
      foto: usuario.foto,
      descricao: usuario.descricao,
      habilitado: usuario.habilitado,
      hashedPassword: hashedPassword,
    });
    const res = await repositorioUsuarios.inserir(insertUsuario);
    if (res[0]) {
      const usuarioId = res[0].id;
      if (opts?.cargos) {
        const ok = await servicoPermissoes.adicionarPermissoesUsuario(
          usuarioId,
          ...opts.cargos,
        );
        if (!ok) {
          error(
            "Novo usuário criado, mas não foi possível configurar as permissões.",
          );
        }
      }
      return usuarioId;
    } else {
      throw new ServerError("Não foi possível criar o usuário.");
    }
  }

  /** Listar seleciona apenas as informações públicas */
  async listarUnicoPublico(id: string): Promise<GetUsuarioSimplesDto | null> {
    const registro = await repositorioUsuarios.selecionarPorId(id);
    if (registro) {
      return {
        id: registro.id,
        nome: registro.nome,
        descricao: registro.descricao,
        foto: registro.foto as string | null,
      };
    } else {
      return null;
    }
  }

  async selecionarTodos(): Promise<GetUsuarioDto[]> {
    const registros = await repositorioUsuarios.selecionarTodos();
    return registros.map((registro) => ({
      id: registro.id,
      nome: registro.nome,
      login: registro.login,
      descricao: registro.descricao,
      habilitado: registro.habilitado,
      modoEscuro: registro.modoEscuro,
      foto: registro.foto ? bufferTostring(registro.foto as Uint8Array) : null,
    }));
  }

  async selecionarPorId(id: string): Promise<GetUsuarioDto | null> {
    const registro = await repositorioUsuarios.selecionarPorId(id);
    if (registro) {
      return {
        id: registro.id,
        nome: registro.nome,
        login: registro.login,
        descricao: registro.descricao,
        habilitado: registro.habilitado,
        modoEscuro: registro.modoEscuro,
        foto: registro.foto as string,
      };
    } else {
      return null;
    }
  }

  // NOTE: Utilizar com cuidado, atualmente utilizado apenas para faker.js
  async listarIds(): Promise<string[]> {
    const registros = await repositorioUsuarios.selecionarIdsTodos();
    return registros.map((registro) => registro.id);
  }

  // TODO: Simplificar? 4 queries na base de dados
  async atualizar(id: string, usuario: UpdateUsuarioDto): Promise<boolean> {
    const registro = await repositorioUsuarios.selecionarPorId(id);
    if (registro) {
      let senha: string | null = null;
      if (usuario.senha) {
        senha = usuario.senha;
        delete usuario.senha;
      }
      const atualizacoes = await repositorioUsuarios.atualizarPorId(
        id,
        usuario,
      );
      if (atualizacoes > 0) {
        if (senha) {
          return this.substituirSenha(id, senha);
        } else {
          return true;
        }
      } else {
        throw new ServerError(
          "Não foi possível atualizar as informações do usuário.",
        );
      }
    } else {
      return false;
    }
  }

  async excluirPorId(id: string): Promise<boolean> {
    const registro = await repositorioUsuarios.selecionarPorId(id);
    if (registro) {
      const atualizacoes = await repositorioUsuarios.excluirPorId(id);
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
    const res = await repositorioUsuarios.contar();
    return res!.count;
  }

  // TODO: Unificar validação de senha
  // async validarSenhaPorLogin(): Promise<boolean> {}
  // async validarSenhaPorLogin(): Promise<boolean> {}

  // TODO: Verificar necessidade de invalidar sessões
  async substituirSenha(usuarioId: string, senha: string): Promise<boolean> {
    const registro = await repositorioUsuarios.selecionarPorId(usuarioId);
    if (registro) {
      // Realizar hash da nova senha
      const hashedPassword = await hashSenha(senha);
      // Atualizar a senha
      const updates = await repositorioUsuarios.atualizarPorId(usuarioId, {
        hashedPassword,
      });
      if (updates === 1) {
        return true;
      } else {
        throw new ServerError(
          "Não foi possível substituir a senha do usuário.",
        );
      }
    } else {
      return false;
    }
  }

  async alterarSenha(
    usuarioId: string,
    senhaAnterior: string,
    senhaNova: string,
  ): Promise<boolean> {
    // Verificar se a senha confere
    const registro = await repositorioUsuarios.selecionarPorId(usuarioId);
    if (registro) {
      const passwordCheck = await compare(
        senhaAnterior,
        registro.hashedPassword,
      );
      if (!passwordCheck) {
        error("A senha informada não confere.", { label: "Auth" });
        throw new ClientError("Unauthorized", 401);
      }
      // Realizar hash da nova senha
      const hashedPassword = await hashSenha(senhaNova);
      // Atualizar a senha
      const updates = await repositorioUsuarios.atualizarPorId(usuarioId, {
        hashedPassword,
      });
      if (updates === 1) {
        return true;
      } else {
        throw new ServerError(
          "Não foi possível substituir a senha do usuário.",
        );
      }
    } else {
      error("Nenhum usuário com o login informado foi encontrado.", {
        label: "Auth",
      });
      throw new ClientError("Unauthorized", 401);
    }
  }
}

const servicoUsuarios = new ServicoUsuarios();

export default servicoUsuarios;
