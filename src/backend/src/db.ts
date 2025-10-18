import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./db/schema";

const baseDados = drizzle(process.env.DB_FILE_NAME!, { schema });

export default baseDados;
