const http = require("http");
const fs = require("fs");

// Fonction pour écrire le fichier JSON
function writeJSONFile(content) {
  fs.writeFile("task.json", content, (error) => {
    if (error) throw error;
    console.log("Écriture terminée");
  });
}

const server = http.createServer((request, response) => {
  // Ajouter les en-têtes CORS pour autoriser les requêtes cross-origin
  response.setHeader("Access-Control-Allow-Origin", "*"); // Permet les requêtes provenant de n'importe quelle origine
  response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS"); // Autoriser certaines méthodes HTTP
  response.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Autoriser certains en-têtes

  // Gérer les requêtes OPTIONS (préflight) utilisées par CORS
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  const { headers, method, url } = request;
  if (method === "POST" && url === "/write-json") {
    let body = [];
    request
      .on("error", (err) => {
        console.error(err);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        writeJSONFile(body);
      });
  } else {
    // Si la requête ne correspond pas à POST /write-json
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route non trouvée");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
