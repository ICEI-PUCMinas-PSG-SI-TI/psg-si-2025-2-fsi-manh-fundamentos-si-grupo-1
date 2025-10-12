import { drizzle } from "drizzle-orm/libsql";

const baseDados = drizzle(process.env.DB_FILE_NAME!);

export default baseDados;
