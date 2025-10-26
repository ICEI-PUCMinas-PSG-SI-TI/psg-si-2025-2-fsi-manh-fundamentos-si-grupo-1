import type { UpdateConfiguracaoSchema } from "../db/schema/configuracoes";
import { RepositorioConfiguracoes } from "../repository/repositorioConfiguracoes";

const repositorioConfiguracoes = new RepositorioConfiguracoes();

// Por enquanto haverá apenas 1 configuração padrão
const defaultUuid = "00000000-0000-0000-0000-000000000000";

async function inicializar() {
  const res = await repositorioConfiguracoes.inserir({ id: defaultUuid });
  if (res.length === 0) throw new Error();
  else return res[0]!;
}

class ServicoConfiguracoes {
  async selecionar() {
    const res = await repositorioConfiguracoes.selecionarPorId(defaultUuid);
    if (res.length === 0) return await inicializar();
    else return res[0]!;
  }

  async atualizar(configuracoes: UpdateConfiguracaoSchema) {
    const res = await repositorioConfiguracoes.atualizarPorId(
      defaultUuid,
      configuracoes,
    );
    return res;
  }
}

const servicoConfiguracoes = new ServicoConfiguracoes();

export default servicoConfiguracoes;
