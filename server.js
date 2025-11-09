const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const http = require('http');

const url = "https://www.uspceu.com/oferta/grado/sistemas-informacion/plan-estudios";

async function sacarAsignaturas() {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const bloque = $("#cursos-tabContent");
    let texto = "";

    const cursos = bloque.find("div[id]");
    for (let i = 0; i < cursos.length; i++) {
      const curso = $(cursos[i]);
      const id = curso.attr("id");
      if (!id.includes("Curso")) continue;
      texto += `\n${id}\n`;

      const filas = curso.find("tbody tr");
      for (let j = 0; j < filas.length; j++) {
        const fila = $(filas[j]);
        const asignatura = fila.find("td").first().text().trim();
        if (asignatura) texto += ` - ${asignatura}\n`;
      }
    }

    fs.writeFileSync("asignaturas.txt", texto);
    console.log("Archivo asignaturas.txt creado con éxito");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

sacarAsignaturas();

const server = http.createServer((req, res) => {
  fs.readFile(archivo, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error al leer el archivo.");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(data);
  });
});

// Iniciamos el servidor
server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
