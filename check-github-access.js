#!/usr/bin/env node

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

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || getTokenFromFile();

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: body ? JSON.parse(body) : {}, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function checkToken() {
  console.log('🔍 Verificando token...\n');
  
  const options = {
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js Check Script',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  const response = await makeRequest(options);
  if (response.status === 200) {
    console.log(`✅ Token válido`);
    console.log(`   Usuário: ${response.data.login}`);
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Tipo: ${response.data.type}`);
    
    // Verificar permissões do token
    const scopes = response.headers['x-oauth-scopes'] || '';
    console.log(`   Escopos: ${scopes || 'Nenhum escopo retornado'}`);
    
    if (!scopes.includes('repo')) {
      console.log(`   ⚠️  FALTA: escopo 'repo' necessário`);
    }
    if (!scopes.includes('admin:org')) {
      console.log(`   ⚠️  FALTA: escopo 'admin:org' necessário`);
    }
    
    return response.data;
  } else {
    console.log(`❌ Token inválido: ${response.status}`);
    return null;
  }
}

async function checkOrg(orgName) {
  console.log(`\n🔍 Verificando organização ${orgName}...\n`);
  
  const options = {
    hostname: 'api.github.com',
    path: `/orgs/${orgName}`,
    method: 'GET',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js Check Script',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  const response = await makeRequest(options);
  if (response.status === 200) {
    console.log(`✅ Organização encontrada`);
    console.log(`   Nome: ${response.data.login}`);
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Tipo: ${response.data.type}`);
    
    // Verificar se o usuário é membro/admin
    const membershipOptions = {
      hostname: 'api.github.com',
      path: `/orgs/${orgName}/memberships/${process.env.USER || 'nodeneoprotocol'}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Node.js Check Script',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    
    const membershipResponse = await makeRequest(membershipOptions);
    if (membershipResponse.status === 200) {
      console.log(`   Status de membro: ${membershipResponse.data.role}`);
      console.log(`   Estado: ${membershipResponse.data.state}`);
    } else {
      console.log(`   ⚠️  Não é membro da organização ou sem permissão para verificar`);
    }
    
    return response.data;
  } else if (response.status === 404) {
    console.log(`❌ Organização não encontrada`);
    return null;
  } else {
    console.log(`❌ Erro ao verificar organização: ${response.status}`);
    console.log(`   ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function checkRepo(owner, repo) {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}`,
    method: 'GET',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js Check Script',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  const response = await makeRequest(options);
  if (response.status === 200) {
    console.log(`   ✅ ${repo} - Acessível`);
    console.log(`      Permissões: ${JSON.stringify(response.data.permissions || {})}`);
    return true;
  } else if (response.status === 404) {
    console.log(`   ❌ ${repo} - Não encontrado`);
    return false;
  } else if (response.status === 403) {
    console.log(`   ⚠️  ${repo} - Sem permissão (403)`);
    return false;
  } else {
    console.log(`   ❌ ${repo} - Erro: ${response.status}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('DIAGNÓSTICO DE ACESSO GITHUB');
  console.log('='.repeat(60) + '\n');
  
  const user = await checkToken();
  if (!user) {
    process.exit(1);
  }
  
  await checkOrg('NEO-FlowOFF');
  
  console.log(`\n🔍 Verificando acesso aos repositórios...\n`);
  const repos = [
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
  
  for (const repo of repos) {
    await checkRepo('neomello', repo);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('FIM DO DIAGNÓSTICO');
  console.log('='.repeat(60));
}

main().catch(console.error);

