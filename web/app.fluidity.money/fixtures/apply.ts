import { open, readdir, readFile } from "fs/promises";
import { parse } from "csv/sync";
import path from "path";

const getTableData = async () => {
  return readdir(__dirname).then(
    async (files) =>
      await Promise.all(
        files
          .filter((file: string) => file.endsWith(".csv"))
          .map(async (file: string) => {
            return [
              file.substring(0, -4),
              await open(path.join(__dirname, file), "r")
                .then((fd) => {
                  const data = readFile(fd);
                  return data;
                })
                .then((data) => parse(data) as string[][]),
            ] as [string, string[][]];
          })
      )
  );
};

const generateSql = async () => {
  const tableData = await getTableData();
  return tableData
    .map(([tableName, rows]) => {
      const columns = rows[0];
      const values = rows.slice(1);
      return `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES\n${values
        .map((row) => `(${row.map((cell) => `'${cell}'`).join(", ")})`)
        .join(",\n")};`;
    })
    .join("\n");
};

console.log(await generateSql());
