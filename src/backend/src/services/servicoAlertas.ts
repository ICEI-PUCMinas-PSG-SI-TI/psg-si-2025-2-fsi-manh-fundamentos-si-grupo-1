import { MotivoAlerta } from "../db/enums/motivoAlerta";
import repositorioAlertas from "../repository/repositorioAlertas";
import repositorioLotes from "../repository/repositorioLotes";
import repositorioProdutos from "../repository/repositorioProdutos";

// Tempo padrão: 24 horas (em milisegundos)
const HORAS_24 = 24 * 60 * 60 * 1000;
const MES_1 = 30 * 24 * 60 * 60 * 1000;

export type GetAlertasDto = {
  id: string;
  produtoId: string;
  loteId: string | null;
  motivo: MotivoAlerta;
  mutadoAte: string | null;
};

export type SetAlertasDto = {
  produtoId: string;
  loteId?: string | null;
  motivo: MotivoAlerta;
};

class ServicoAlertas {
  async selecionarPorId(id: string): Promise<GetAlertasDto | null> {
    const registro = await repositorioAlertas.selecionarPorId(id);
    if (registro) {
      return {
        id: registro.id,
        produtoId: registro.produtoId,
        loteId: registro.loteId,
        motivo: registro.motivo,
        mutadoAte: registro.mutadoAte ? registro.mutadoAte.toISOString() : null,
      };
    } else {
      return null;
    }
  }

  async listarTodos(): Promise<GetAlertasDto[]> {
    const registros = await repositorioAlertas.selecionarTodos();
    return registros.map((registro) => ({
      id: registro.id,
      loteId: registro.loteId,
      produtoId: registro.produtoId,
      motivo: registro.motivo,
      mutadoAte: registro.mutadoAte ? registro.mutadoAte.toISOString() : null,
    }));
  }

  async contarNaoMutados(): Promise<number> {
    const res = await repositorioAlertas.contarNaoMutados();
    return res!.count;
  }

  // TODO: servicoAlertas/conferirProduto(produtoId)
  // -> Chamado na alteração de produtos.
  // -> Verifica se produto possui alguma pendência
  // -> Verifica se há valores na base de dados relacionados ao produto
  // -> Compara read() vs write()
  async conferirProduto(produtoId: string): Promise<boolean> {
    const registros = await repositorioProdutos.selecionarConsultaCompleta({
      comId: produtoId,
    });
    const registro = registros[0];
    if (registro) {
      if (
        registro.quantidadeMaxima !== null &&
        registro.quantidade > registro.quantidadeMaxima
      ) {
        await repositorioAlertas.inserir({
          produtoId: produtoId,
          motivo: MotivoAlerta.QuantidadeMaxima,
        });
      }

      if (
        registro.quantidadeMinima !== null &&
        registro.quantidade < registro.quantidadeMinima
      ) {
        await repositorioAlertas.inserir({
          produtoId: produtoId,
          motivo: MotivoAlerta.QuantidadeMinima,
        });
      }
      // TODO: Remover valores anteriores referente ao produto e adicionar novamente.
      return true;
    } else {
      return false;
    }
  }

  async conferirLotes(produtoId: string): Promise<boolean> {
    const registros = await repositorioLotes.selecionarConsulta({
      comProdutoId: produtoId,
    });
    if (registros) {
      const valores = registros
        .filter((registro) => {
          if (registro.validade) {
            const daqui1Mes = new Date().getTime() + MES_1;
            return registro.validade < new Date(daqui1Mes);
          } else {
            return false;
          }
        })
        .map((registro) => ({
          produtoId: registro.produtoId,
          loteId: registro.id,
          motivo: MotivoAlerta.Validade,
        }));
      // TODO: Remover valores anteriores referente ao lote e adicionar novamente.
      // await repositorioAlertas.inserir(...valores);
      return true;
    } else {
      return false;
    }
  }

  // TODO: Chamado periodicamente na inicialização do programa
  async conferirTodos(): Promise<string[]> {
    const registrosQuant =
      await repositorioProdutos.selecionarQuantidadesAlertas();

    const validadeAte = new Date(new Date().getTime() + HORAS_24);
    const registrosVal =
      await repositorioLotes.selecionarValidadeAlertas(validadeAte);

    const registros: SetAlertasDto[] = [];
    registrosQuant.forEach((registro) => {
      if (
        registro.quantidadeMaxima !== null &&
        registro.quantidade >= registro.quantidadeMaxima
      ) {
        registros.push({
          produtoId: registro.id,
          motivo: MotivoAlerta.QuantidadeMaxima,
        });
      } else if (
        registro.quantidadeMinima !== null &&
        registro.quantidade <= registro.quantidadeMinima
      ) {
        registros.push({
          produtoId: registro.id,
          motivo: MotivoAlerta.QuantidadeMinima,
        });
      } else {
        throw new Error("Erro ao verificar alertas.");
      }
    });
    await repositorioAlertas.excluirTodos();
    registrosVal.forEach((registro) =>
      registros.push({
        loteId: registro.id,
        produtoId: registro.produtoId,
        motivo: MotivoAlerta.Validade,
      }),
    );
    const registrosIds = await repositorioAlertas.inserir(...registros);
    return registrosIds.map((registro) => registro.id);
  }

  // Tempo padrão: 24 horas
  async ignorarAlerta(id: string): Promise<boolean> {
    const registro = await repositorioAlertas.selecionarPorId(id);
    if (registro) {
      const mutarAte = new Date(new Date().getTime() + HORAS_24);
      await repositorioAlertas.atualizarPorId(id, {
        mutadoAte: mutarAte,
      });
      return true;
    } else {
      return false;
    }
  }
}

const servicoAlertas = new ServicoAlertas();

export default servicoAlertas;
