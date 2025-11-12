import { drizzle } from "drizzle-orm/libsql";
import { error, json, LogLevel, notice, warning } from "./logging";
import { DrizzleQueryError, sql } from "drizzle-orm";
import { tabelaLotes } from "./db/schema/lotes";
import { tabelaCategorias } from "./db/schema/categorias";
import { tabelaConfiguracoes } from "./db/schema/configuracoes";
import { tabelaProdutos } from "./db/schema/produtos";
import { tabelaSessoes } from "./db/schema/sessoes";
import { tabelaTransacoes } from "./db/schema/transacoes";
import { tabelaUnidadesMedida } from "./db/schema/unidadesMedida";
import { tabelaUsuarios } from "./db/schema/usuarios";
import servicoUsuarios from "./services/servicoUsuarios";
import { Permissoes, tabelaPermissoes } from "./db/schema/permissoes";

const baseDados = drizzle(process.env.DB_FILE_NAME!);

// TODO: Verificar se a base de dados se encontra no último schema
export async function verificarBancoDados(): Promise<boolean> {
  warning("Verificando conexão a base de dados...", { label: "db" });
  try {
    const tables = [
      tabelaCategorias,
      tabelaConfiguracoes,
      tabelaLotes,
      tabelaPermissoes,
      tabelaProdutos,
      tabelaSessoes,
      tabelaTransacoes,
      tabelaUnidadesMedida,
      tabelaUsuarios,
    ];
    for (let i = 0; i < tables.length; i++) {
      await baseDados
        .select({
          value: sql`1`,
        })
        .from(tables[i]!);
    }
    notice("Conexão a base de dados OK.", { label: "db" });
  } catch (err) {
    if (err instanceof DrizzleQueryError && err.cause instanceof Error) {
      error(err.cause?.message, { label: "db" });
      error(
        '* Verificar se a base de dados foi inicializada corretamente: "bun run db:push"',
        { label: "db" },
      );
      return false;
    } else {
      throw err;
    }
  }
  return true;
}

// Verifica se há usuários cadastrados no sistema, se não houver, inicializa um administrador
// TODO: Inicializar apenas 1 vez, armazenar informação em configurações.
export async function inicializarAdministrador() {
  const count = await servicoUsuarios.contar();
  if (count === 0) {
    const login = "Administrador";
    const senha = "Admin123-";
    await servicoUsuarios.inserir(
      {
        nome: login,
        login: login,
        password: senha,
        descricao: login,
        habilitado: true,
        nivelPermissoes: 0,
      },
      { cargos: [Permissoes.Administrador] },
    );
    warning("Nenhum usuário foi encontrado. Credênciais de primeira entrada: ");
    json(
      {
        login,
        senha,
      },
      LogLevel.Warning,
    );
  }
}

export default baseDados;
