import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

export function resolveImports(code: String, imports: Array<string> = []) {
  let lines = code.split(os.EOL);
  let newLines = [];
  let importedCode = [];

  lines.forEach((line: String) => {
    if (line.includes("import ")) {
      let resolvedImport = resolveSingleImport(line, imports);
      importedCode.push(resolvedImport);
    } else {
      newLines.push(line);
    }
  });

  newLines = importedCode.concat(newLines);
  return newLines.join(os.EOL);
}

function resolveSingleImport(line: String, imports: Array<string>) {
  let localPath = vscode.Uri.file(path.dirname(vscode.window.activeTextEditor.document.uri.path) + path.sep);
  let elements = line.split(";");
  elements = elements[0].split(" ");
  let importPath = elements[elements.length - 1];
  importPath = importPath.slice(1, importPath.length - 1);

  let filePath = path.resolve(localPath.fsPath, importPath);
  if (path.extname(filePath) != ".js") {
    filePath += ".js";
  }
  if (imports.includes(filePath)) {
    return undefined;
  }
  imports.push(filePath);

  let file = fs.readFileSync(filePath, "utf8");
  file = file.replace("export default ", "");
  file = file.replace("export ", "");

  return resolveImports(file, imports);
}
