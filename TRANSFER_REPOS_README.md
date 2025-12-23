# 📦 Transferência de Repositórios para NEO-FlowOFF

Este guia detalha o processo de transferência de repositórios do perfil pessoal `neomello` para a organização `NEO-FlowOFF`.

## 📋 Repositórios a Transferir

1. `flwff_dao`
2. `flowcloser-agent`
3. `flowpay_lite`
4. `flowcloser`
5. `flowpay_landing`
6. `agent-neo-flowoff`
7. `flow25`
8. `evolution-flow`
9. `flowoffmkt`

## 🚀 Método 1: Script Automatizado (Recomendado)

### Pré-requisitos

- ✅ **Node.js** 14.x ou superior instalado
- ✅ **Personal Access Token (PAT)** do GitHub com permissões:
  - `repo` - Acesso completo aos repositórios
  - `admin:org` - Administração de organizações

### Como Criar um Personal Access Token

1. Acesse [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Configure:
   - **Nome**: `NEO-FlowOFF Transfer Scripts`
   - **Expiração**: Escolha conforme necessário
   - **Escopos**:
     - ✅ `repo` (todos)
     - ✅ `admin:org` (todos)
4. Clique em **"Generate token"**
5. ⚠️ **Copie o token imediatamente** - você não poderá vê-lo novamente

### Executando o Script

#### Configuração do Token

**Opção A: Arquivo de Configuração (Recomendado)**

```bash
echo "GITHUB_TOKEN=seu_token_aqui" > ~/.github-token
chmod 600 ~/.github-token
```

**Opção B: Variável de Ambiente**

```bash
export GITHUB_TOKEN=seu_token_aqui
```

#### Execução

```bash
# Torne o script executável (se necessário)
chmod +x transfer-repos.js

# Execute o script
node transfer-repos.js
```

#### O que o Script Faz

O script automaticamente:

- ✅ Verifica se o token é válido
- ✅ Verifica se os repositórios já foram transferidos
- ✅ Transfere cada repositório sequencialmente
- ✅ Mostra o progresso em tempo real
- ✅ Exibe um resumo final detalhado

### Exemplo de Saída

```bash
🚀 Iniciando transferência de repositórios...

📦 Origem: neomello
🏢 Destino: NEO-FlowOFF
📋 Repositórios: 9

✅ Token válido - Usuário: neomello

==================================================

✅ flwff_dao já está na organização NEO-FlowOFF
✅ flowcloser-agent já está na organização NEO-FlowOFF
✅ flowpay_lite já está na organização NEO-FlowOFF
...

==================================================
📊 RESUMO DA TRANSFERÊNCIA

✅ Sucesso: 9/9
   - flwff_dao
   - flowcloser-agent
   - flowpay_lite
   ...
==================================================
```

## 🔧 Método 2: Transferência Manual

Se preferir fazer manualmente ou se o script não funcionar:

### Passo a Passo

Para cada repositório:

1. **Acesse o repositório:**
   - Vá para: `https://github.com/neomello/[nome-do-repo]`

2. **Acesse as Configurações:**
   - Clique em **"Settings"** (no topo da página do repositório)

3. **Encontre a Zona de Perigo:**
   - Role até o final da página
   - Encontre a seção **"Danger Zone"**

4. **Inicie a Transferência:**
   - Clique em **"Transfer ownership"**
   - Digite o nome completo do repositório para confirmar
   - No campo **"New owner"**, digite: `NEO-FlowOFF`
   - Clique em **"I understand, transfer this repository"**

5. **Confirme a Transferência:**
   - Uma notificação será enviada para a organização
   - A transferência será concluída automaticamente

### Observações Importantes

- ⚠️ **Issues, Pull Requests e Wikis** são transferidos junto
- ⚠️ **Stars e Watchers** são mantidos
- ⚠️ **Webhooks** precisam ser reconfigurados após a transferência
- ⚠️ **Deploy keys** precisam ser recriadas
- ⚠️ **Git remotes** dos clones locais precisam ser atualizados

## 🔄 Atualizando Remotes Locais

Após a transferência, você precisa atualizar os remotes dos seus clones locais.

### Para Repositórios HTTPS

```bash
cd [nome-do-repo]
git remote set-url origin https://github.com/NEO-FlowOFF/[nome-do-repo].git
git remote -v  # Verificar se foi atualizado corretamente
```

### Para Repositórios SSH

```bash
cd [nome-do-repo]
git remote set-url origin git@github.com:NEO-FlowOFF/[nome-do-repo].git
git remote -v  # Verificar se foi atualizado corretamente
```

### Script para Atualizar Todos

Você pode criar um script para atualizar todos de uma vez:

```bash
# Lista de repositórios
repos=(
  "flwff_dao"
  "flowcloser-agent"
  "flowpay_lite"
  "flowcloser"
  "flowpay_landing"
  "agent-neo-flowoff"
  "flow25"
  "evolution-flow"
  "flowoffmkt"
)

# Atualiza cada repositório
for repo in "${repos[@]}"; do
  if [ -d "$repo" ]; then
    echo "Atualizando $repo..."
    cd "$repo"
    git remote set-url origin "https://github.com/NEO-FlowOFF/$repo.git"
    cd ..
  fi
done
```

## ✅ Verificação

Após a transferência, verifique:

1. Os repositórios aparecem em: https://github.com/NEO-FlowOFF
2. Os repositórios não aparecem mais em: https://github.com/neomello
3. Os links antigos redirecionam automaticamente para os novos

## 🆘 Solução de Problemas

### ❌ Erro: "Repository not found" (404)

**Possíveis causas:**
- Repositório não existe
- Nome do repositório incorreto
- Sem acesso ao repositório

**Soluções:**
1. Verifique se o repositório existe em: `https://github.com/neomello/[nome-do-repo]`
2. Confirme o nome exato do repositório (case-sensitive)
3. Verifique suas permissões no repositório

### ❌ Erro: "Forbidden" (403)

**Possíveis causas:**
- Token sem permissões suficientes
- Token associado à conta errada
- Sem acesso de administrador na organização

**Soluções:**
1. Execute o script de diagnóstico: `node check-github-access.js`
2. Verifique as permissões do token em [GitHub Settings](https://github.com/settings/tokens)
3. Crie um novo token com todas as permissões necessárias
4. Verifique se você é administrador da organização `NEO-FlowOFF`

### ❌ Erro: "Organization not found"

**Soluções:**
1. Verifique se a organização existe: `https://github.com/NEO-FlowOFF`
2. Confirme a grafia do nome (case-sensitive)
3. Verifique se você é membro/administrador da organização

### ⚠️ Rate Limiting

O GitHub limita requisições por hora. O script já inclui:
- ⏱️ Delay de 1 segundo entre requisições
- 🔄 Tratamento automático de erros

**Se ainda ocorrer:**
- Aguarde alguns minutos
- Execute novamente o script
- Verifique seu limite em: [GitHub Rate Limit](https://api.github.com/rate_limit)

## 📞 Suporte e Recursos

### Documentação Oficial

- 📖 [Transferir Repositório - GitHub Docs](https://docs.github.com/pt/repositories/creating-and-managing-repositories/transferring-a-repository)
- 🔌 [GitHub API - Transfer Repository](https://docs.github.com/en/rest/repos/repos#transfer-a-repository)
- 📝 [Sintaxe Markdown - GitHub](https://docs.github.com/pt/get-started/writing-on-github/getting-started-with-writing-and-formating-on-github/basic-writing-and-formating-syntax)
- 🔐 [Personal Access Tokens - GitHub Docs](https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

### Scripts de Ajuda

Execute o script de diagnóstico para verificar problemas:

```bash
node check-github-access.js
```

Este script verifica:
- ✅ Validade do token
- ✅ Permissões disponíveis
- ✅ Acesso à organização
- ✅ Status de cada repositório

---

**📅 Última atualização:** 2025-01-27

