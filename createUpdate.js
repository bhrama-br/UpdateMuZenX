const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Função para calcular o checksum de um arquivo
function calculateChecksum(filePath) {
  const hash = crypto.createHash('sha256'); // Usando SHA-256 para gerar o checksum
  const fileBuffer = fs.readFileSync(filePath); // Lê o conteúdo do arquivo
  hash.update(fileBuffer); // Atualiza o hash com o conteúdo do arquivo
  return hash.digest('hex'); // Retorna o checksum como hexadecimal
}

// Função para percorrer um diretório e seus subdiretórios
function getFilesInDirectory(directory) {
  let files = [];
  const items = fs.readdirSync(directory); // Lê os itens no diretório
  
  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      // Se for um diretório, chama recursivamente
      files = files.concat(getFilesInDirectory(fullPath));
    } else {
      // Se for um arquivo, adiciona à lista
      files.push(fullPath);
    }
  }
  
  return files;
}

// Função principal para gerar o arquivo JSON
function generateFileJson(directory) {
  const files = getFilesInDirectory(directory);
  const fileDetails = files.map(filePath => {
    const relativePath = path.relative(directory, filePath); // Caminho relativo a partir do diretório base
    const checksum = calculateChecksum(filePath); // Calcula o checksum
    
    // Construa o objeto conforme o formato necessário
    return {
      name: relativePath.replace(/\\/g, '/'), // Usando o caminho relativo com barras normais
      checksum: checksum,
      url: `https://raw.githubusercontent.com/bhrama-br/UpdateMuZenX/main/${relativePath.replace(/\\/g, '/')}`
    };
  });
  
  // Cria o JSON final
  const jsonOutput = {
    files: fileDetails
  };
  
  // Escreve o JSON no arquivo
  fs.writeFileSync('fileDetails.json', JSON.stringify(jsonOutput, null, 2));
  console.log('Arquivo JSON gerado com sucesso: fileDetails.json');
}

// Executa a função com o diretório desejado
const directoryToScan = './'; // Você pode mudar para o diretório desejado
generateFileJson(directoryToScan);
