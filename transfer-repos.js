#!/usr/bin/env node

/**
 * Script para transferir repositórios do GitHub de um perfil pessoal para uma organização
 * 
 * Uso:
 *   node transfer-repos.js
 * 
 * Requisitos:
 *   - Token de acesso pessoal do GitHub com permissões: repo, admin:org
 *   - Variável de ambiente GITHUB_TOKEN configurada
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Função para ler token do arquivo
function getTokenFromFile() {
  try {
    const tokenFile = path.join(require('os').homedir(), '.github-token');
    if (fs.existsSync(tokenFile)) {
      const content = fs.readFileSync(tokenFile, 'utf8');
      const match = content.match(/GITHUB_TOKEN=(.+)/);
      if (match) {
        return match[1].trim();
      }
    }
  } catch (error) {
    // Ignora erros ao ler arquivo
  }
  return null;
}

// Configurações - tenta variável de ambiente primeiro, depois arquivo
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || getTokenFromFile();
const SOURCE_OWNER = 'neomello';
const TARGET_ORG = 'NEO-FlowOFF';

// Lista de repositórios para transferir
const REPOSITORIES = [
  'flwff_dao',
  'flowcloser-agent',
  'flowpay_lite',
  'flowcloser',
  'flowpay_landing',
  'agent-neo-flowoff',
  'flow25',
  'evolution-flow',
  'flowoffmkt'
];

if (!GITHUB_TOKEN) {
  console.error('❌ Erro: Variável de ambiente GITHUB_TOKEN não configurada');
  console.error('\nConfigure o token antes de executar:');
  console.error('  export GITHUB_TOKEN=seu_token_aqui');
  console.error('\nOu crie um arquivo .env com:');
  console.error('  GITHUB_TOKEN=seu_token_aqui');
  process.exit(1);
}

/**
 * Faz uma requisição HTTP para a GitHub API
 */
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Transfere um repositório para a organização
 */
async function transferRepository(repoName) {
  const url = `/repos/${SOURCE_OWNER}/${repoName}/transfer`;
  
  const options = {
    hostname: 'api.github.com',
    path: url,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js Transfer Script',
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  };
  
  const payload = {
    new_owner: TARGET_ORG,
    team_ids: [] // Opcional: IDs de equipes para adicionar o repositório
  };
  
  // Primeiro verifica se o repositório já está na organização
  const checkOptions = {
    hostname: 'api.github.com',
    path: `/repos/${TARGET_ORG}/${repoName}`,
    method: 'GET',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js Transfer Script',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  try {
    const checkResponse = await makeRequest(checkOptions);
    if (checkResponse.status === 200) {
      console.log(`✅ ${repoName} já está na organização ${TARGET_ORG}`);
      return { success: true, repo: repoName, alreadyTransferred: true };
    }
  } catch (error) {
    // Continua com a transferência se não encontrar na organização
  }
  
  try {
    console.log(`🔄 Transferindo ${repoName}...`);
    const response = await makeRequest(options, payload);
    
    if (response.status === 202) {
      console.log(`✅ ${repoName} transferido com sucesso!`);
      return { success: true, repo: repoName };
    } else if (response.status === 307 || response.status === 301) {
      // Redirect permanente - repositório já foi transferido
      console.log(`✅ ${repoName} já foi transferido anteriormente`);
      return { success: true, repo: repoName, alreadyTransferred: true };
    } else if (response.status === 404) {
      console.log(`⚠️  ${repoName} não encontrado ou sem permissão`);
      return { success: false, repo: repoName, error: 'Not found' };
    } else if (response.status === 403) {
      console.log(`⚠️  ${repoName} - Sem permissão (verifique o token)`);
      return { success: false, repo: repoName, error: 'Forbidden' };
    } else {
      console.log(`❌ ${repoName} - Erro: ${response.status}`);
      console.log(`   Resposta: ${JSON.stringify(response.data)}`);
      return { success: false, repo: repoName, error: response.data };
    }
  } catch (error) {
    console.log(`❌ ${repoName} - Erro na requisição: ${error.message}`);
    return { success: false, repo: repoName, error: error.message };
  }
}

/**
 * Verifica se o token tem as permissões necessárias
 */
async function verifyToken() {
  const options = {
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js Transfer Script',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  try {
    const response = await makeRequest(options);
    if (response.status === 200) {
      console.log(`✅ Token válido - Usuário: ${response.data.login}`);
      return true;
    } else {
      console.error(`❌ Token inválido ou sem permissões`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erro ao verificar token: ${error.message}`);
    return false;
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando transferência de repositórios...\n');
  console.log(`📦 Origem: ${SOURCE_OWNER}`);
  console.log(`🏢 Destino: ${TARGET_ORG}`);
  console.log(`📋 Repositórios: ${REPOSITORIES.length}\n`);
  
  // Verifica o token
  const tokenValid = await verifyToken();
  if (!tokenValid) {
    process.exit(1);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Transfere cada repositório
  const results = [];
  for (const repo of REPOSITORIES) {
    const result = await transferRepository(repo);
    results.push(result);
    
    // Aguarda 1 segundo entre requisições para evitar rate limiting
    if (repo !== REPOSITORIES[REPOSITORIES.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DA TRANSFERÊNCIA\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Sucesso: ${successful.length}/${REPOSITORIES.length}`);
  if (successful.length > 0) {
    successful.forEach(r => console.log(`   - ${r.repo}`));
  }
  
  if (failed.length > 0) {
    console.log(`\n❌ Falhas: ${failed.length}/${REPOSITORIES.length}`);
    failed.forEach(r => console.log(`   - ${r.repo}: ${r.error}`));
  }
  
  console.log('\n' + '='.repeat(50));
}

// Executa o script
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

