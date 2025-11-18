import * as z4 from "zod/v4";
import {
  UpdateConfiguracaoSchemaZ,
  type SelectConfiguracaoSchema,
  type UpdateConfiguracaoSchema,
} from "../db/schema/configuracoes";
import { RepositorioConfiguracoes } from "../repository/repositorioConfiguracoes";

const repositorioConfiguracoes = new RepositorioConfiguracoes();

// Por enquanto haverá apenas 1 configuração padrão
const defaultUuid = "00000000-0000-0000-0000-000000000000";

export const ParamsInserirConfiguracoesZ = UpdateConfiguracaoSchemaZ.pick({
  nomeCliente: true,
  cpfCnpj: true,
  endereco: true,
});

export type ParamsInserirConfiguracoes = z4.infer<
  typeof ParamsInserirConfiguracoesZ
>;

/**
 * Essa função garante que o único registro de configurações na base de dados existe
 */
async function inicializar() {
  const resSel1 = await repositorioConfiguracoes.selecionarPorId(defaultUuid);
  if (resSel1) return;
  await repositorioConfiguracoes.inserir({ id: defaultUuid });
  const resSel2 = await repositorioConfiguracoes.selecionarPorId(defaultUuid);
  if (resSel2) throw new Error();
}

class ServicoConfiguracoes {
  async selecionar(): Promise<SelectConfiguracaoSchema | undefined> {
    await inicializar();
    return repositorioConfiguracoes.selecionarPorId(defaultUuid);
  }

  async atualizar(configuracoes: UpdateConfiguracaoSchema) {
    await inicializar();
    const _configuracoes = UpdateConfiguracaoSchemaZ.parse(configuracoes);
    return repositorioConfiguracoes.atualizarPorId(defaultUuid, _configuracoes);
  }
}

const servicoConfiguracoes = new ServicoConfiguracoes();

export default servicoConfiguracoes;
