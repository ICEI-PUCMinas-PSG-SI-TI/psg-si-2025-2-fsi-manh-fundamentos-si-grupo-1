import * as z4 from "zod/v4";
import { Identificador } from "../db/enums/identificador";
import { ServerError } from "../error";
import repositorioConfiguracoes from "../repository/repositorioConfiguracoes";

// Por enquanto haverá apenas 1 configuração padrão
const defaultUuid = "00000000-0000-0000-0000-000000000000";

export type GetConfiguracaoDto = {
  // id: string;
  nomeCliente: string | null;
  cpfCnpj: string | null;
  endereco: string | null;
  identificador: Identificador;
};

export const UpdateConfiguracaoDtoZ = z4.strictObject({
  nomeCliente: z4.string().nullable().optional(),
  cpfCnpj: z4.string().nullable().optional(),
  endereco: z4.string().nullable().optional(),
  identificador: z4.enum(Identificador).optional(),
});

export type UpdateConfiguracaoDto = z4.infer<typeof UpdateConfiguracaoDtoZ>;

/**
 * Essa função garante que o único registro de configurações na base de dados existe
 */
async function inicializar(): Promise<void> {
  const resSel1 = await repositorioConfiguracoes.selecionarPorId(defaultUuid);
  if (resSel1) {
    return;
  }
  await repositorioConfiguracoes.inserir({ id: defaultUuid });
  const resSel2 = await repositorioConfiguracoes.selecionarPorId(defaultUuid);
  if (!resSel2) {
    throw new Error(
      "Não foi possível inicializar os valores de configurações.",
    );
  }
}

class ServicoConfiguracoes {
  async selecionar(): Promise<GetConfiguracaoDto | null> {
    await inicializar();
    const registro =
      await repositorioConfiguracoes.selecionarPorId(defaultUuid);
    if (registro) {
      return {
        nomeCliente: registro.nomeCliente,
        cpfCnpj: registro.cpfCnpj,
        endereco: registro.endereco,
        identificador: registro.identificador,
      };
    } else {
      return null;
    }
  }

  async atualizar(configuracoes: UpdateConfiguracaoDto): Promise<boolean> {
    await inicializar();
    const _configuracoes = UpdateConfiguracaoDtoZ.parse(configuracoes);
    const atualizacoes = await repositorioConfiguracoes.atualizarPorId(
      defaultUuid,
      {
        nomeCliente: _configuracoes.nomeCliente,
        cpfCnpj: _configuracoes.cpfCnpj,
        endereco: _configuracoes.endereco,
        identificador: _configuracoes.identificador,
      },
    );
    if (atualizacoes > 0) {
      return true;
    } else {
      throw new ServerError("Não foi possível atualizar as configurações.");
    }
  }
}

const servicoConfiguracoes = new ServicoConfiguracoes();

export default servicoConfiguracoes;
