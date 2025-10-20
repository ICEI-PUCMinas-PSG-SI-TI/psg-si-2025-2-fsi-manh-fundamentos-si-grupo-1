import fs from "fs";

export function exportFile(data: {}, filePath: string) {
  // Convert the JavaScript object to a JSON string
  const jsonString = JSON.stringify(data, null, 2); // The 'null, 2' arguments are for pretty-printing with 2 spaces indentation

  // Write the JSON string to the file
  fs.writeFile(
    filePath,
    jsonString,
    { flag: "wx", encoding: "utf8" },
    (err) => {
      if (err) {
        if (err.code === "EEXIST") {
          console.error("Error escrevendo arquivo JSON: Arquivo já existe!");
        } else {
          console.error("Error escrevendo arquivo JSON:", err);
        }
      } else {
        console.log(`Arquivo JSON criado com sucesso em ${filePath}`);
      }
    }
  );
}
