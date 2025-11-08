import { drizzle } from "drizzle-orm/libsql";
import { error, json, LogLevel, notice, warning } from "./logging";
import { DrizzleQueryError, sql } from "drizzle-orm";
import { lotesTable } from "./db/schema/lotes";
import { categoriasTable } from "./db/schema/categorias";
import { configuracoesTable } from "./db/schema/configuracoes";
import { produtosTable } from "./db/schema/produtos";
import { sessoesTable } from "./db/schema/sessoes";
import { transacoesTable } from "./db/schema/transacoes";
import { unidadesMedidaTable } from "./db/schema/unidadesMedida";
import { usuariosTable } from "./db/schema/usuarios";
import servicoUsuarios from "./services/servicoUsuarios";
import { Permissoes } from "./db/schema/permissoes";

export const baseDados = drizzle(process.env.DB_FILE_NAME!);

// TODO: Verificar se a base de dados se encontra no último schema
export async function verificarBancoDados(): Promise<boolean> {
  warning("Verificando conexão a base de dados...", { label: "db" });
  try {
    const tables = [
      categoriasTable,
      configuracoesTable,
      lotesTable,
      produtosTable,
      sessoesTable,
      transacoesTable,
      unidadesMedidaTable,
      usuariosTable,
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
      { cargo: Permissoes.Administrador },
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
