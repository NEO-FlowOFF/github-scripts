# Contexto dos Scripts GitHub - NEO-FlowOFF

## 🎯 Objetivo

Scripts automatizados para gerenciar e transferir repositórios GitHub entre o perfil pessoal `neomello` e a organização `NEO-FlowOFF`.

## 📁 Arquivos do Projeto

### Scripts Principais

1. **transfer-repos.js**
   - Transfere repositórios de `neomello` para `NEO-FlowOFF`
   - Verifica automaticamente se já foram transferidos
   - Suporta 9 repositórios em lote
   - Gera relatório detalhado

2. **check-github-access.js**
   - Diagnóstico de acesso e permissões
   - Verifica token, organização e repositórios
   - Útil para troubleshooting

### Documentação

- `README.md` - Documentação principal completa
- `TRANSFER_REPOS_README.md` - Guia detalhado de transferência
- `.cursorrules` - Regras e contexto para Cursor AI

## 🔐 Configuração de Autenticação

### Token GitHub

> **📝 Nota**
> O token é lido na seguinte ordem de prioridade:
> 1. Variável de ambiente `GITHUB_TOKEN`
> 2. Variável de ambiente `GITHUB_PAT`
> 3. Arquivo `~/.github-token`

**Configuração Atual:**
- **Localização:** `~/.github-token`
- **Formato:** `GITHUB_TOKEN=ghp_...`
- **Permissões:** `repo`, `admin:org`
- **Permissões do arquivo:** `600` (apenas leitura para o dono)

**Token Classic:**
- ✅ Token classic criado para transferências
- ✅ Salvo em `~/.github-token` com permissões 600
- ✅ Adicionado ao `~/.zshrc` para persistência

### Como Criar um Novo Token

<details>
<summary><strong>Passo a Passo</strong></summary>

1. Acesse [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Configure:
   - **Nome:** `NEO-FlowOFF Transfer Scripts`
   - **Expiração:** Escolha conforme necessário
   - **Escopos:**
     - ✅ `repo` (todos)
     - ✅ `admin:org` (todos)
4. Clique em **"Generate token"**
5. ⚠️ **Copie o token imediatamente** - não será exibido novamente
6. Salve no arquivo:
   ```bash
   echo "GITHUB_TOKEN=seu_token_aqui" > ~/.github-token
   chmod 600 ~/.github-token
   ```
</details>

## 📦 Repositórios Gerenciados

Todos os 9 repositórios foram transferidos com sucesso:

| # | Repositório | Status | URL |
|---|-------------|--------|-----|
| 1 | `flwff_dao` | ✅ Transferido | [github.com/NEO-FlowOFF/flwff_dao](https://github.com/NEO-FlowOFF/flwff_dao) |
| 2 | `flowcloser-agent` | ✅ Transferido | [github.com/NEO-FlowOFF/flowcloser-agent](https://github.com/NEO-FlowOFF/flowcloser-agent) |
| 3 | `flowpay_lite` | ✅ Transferido | [github.com/NEO-FlowOFF/flowpay_lite](https://github.com/NEO-FlowOFF/flowpay_lite) |
| 4 | `flowcloser` | ✅ Transferido | [github.com/NEO-FlowOFF/flowcloser](https://github.com/NEO-FlowOFF/flowcloser) |
| 5 | `flowpay_landing` | ✅ Transferido | [github.com/NEO-FlowOFF/flowpay_landing](https://github.com/NEO-FlowOFF/flowpay_landing) |
| 6 | `agent-neo-flowoff` | ✅ Transferido | [github.com/NEO-FlowOFF/agent-neo-flowoff](https://github.com/NEO-FlowOFF/agent-neo-flowoff) |
| 7 | `flow25` | ✅ Transferido | [github.com/NEO-FlowOFF/flow25](https://github.com/NEO-FlowOFF/flow25) |
| 8 | `evolution-flow` | ✅ Transferido | [github.com/NEO-FlowOFF/evolution-flow](https://github.com/NEO-FlowOFF/evolution-flow) |
| 9 | `flowoffmkt` | ✅ Transferido | [github.com/NEO-FlowOFF/flowoffmkt](https://github.com/NEO-FlowOFF/flowoffmkt) |

## 🏢 Organização

- **Origem:** `neomello` (perfil pessoal)
- **Destino:** `NEO-FlowOFF` (organização GitHub)
- **Status:** Todos transferidos ✅

## 🚀 Como Usar

### Transferir Repositórios

```bash
node transfer-repos.js
```

### Verificar Acesso

```bash
node check-github-access.js
```

### Verificar Configuração

```bash
cat ~/.github-token
echo $GITHUB_TOKEN
```

## ⚙️ Funcionalidades dos Scripts

### transfer-repos.js

<details>
<summary><strong>Funcionalidades Principais</strong></summary>

- ✅ Verifica token antes de executar
- ✅ Verifica se repositórios já foram transferidos
- ✅ Trata erros 307 (redirect permanente)
- ✅ Delay de 1s entre requisições (rate limiting)
- ✅ Relatório final com sucessos e falhas
- ✅ Suporte a múltiplas fontes de token
- ✅ Mensagens de log claras e informativas
</details>

**Fluxo de Execução:**
1. Valida token de autenticação
2. Verifica cada repositório na organização destino
3. Transfere apenas repositórios não transferidos
4. Aguarda 1 segundo entre requisições
5. Gera relatório final detalhado

### check-github-access.js

<details>
<summary><strong>Funcionalidades de Diagnóstico</strong></summary>

- ✅ Valida token e mostra usuário autenticado
- ✅ Lista escopos do token
- ✅ Verifica acesso à organização
- ✅ Verifica status de cada repositório
- ✅ Mostra permissões disponíveis
- ✅ Identifica problemas de configuração
</details>

**Uso Recomendado:**
Execute antes de tentar transferências para diagnosticar problemas de acesso ou permissões.

## 🔧 Tecnologias

- **Node.js** 14+ (módulos nativos: `https`, `fs`, `path`, `os`)
- **GitHub REST API** v3
- **Sem dependências externas** (apenas Node.js padrão)

## 📝 Padrões de Código

- Código funcional quando possível
- Tratamento robusto de erros
- Mensagens de log claras com emojis
- Suporte a múltiplas fontes de configuração
- Verificações de segurança (permissões de arquivo)

## ⚠️ Segurança

> **⚠️ Aviso**
> O arquivo `.github-token` contém credenciais sensíveis e **nunca** deve ser commitado no Git.

> **💡 Dica**
> Use `chmod 600 ~/.github-token` para garantir que apenas você possa ler o arquivo.

> **🔒 Importante**
> O token tem permissões administrativas (`repo` e `admin:org`). Mantenha-o seguro e revogue imediatamente se comprometido.

- ✅ Scripts verificam permissões antes de executar
- ✅ Token armazenado com permissões restritas (600)
- ✅ Suporte a múltiplas fontes de configuração

## 🔄 Próximos Passos Após Transferência

<details>
<summary><strong>Checklist Pós-Transferência</strong></summary>

- [ ] Atualizar remotes locais dos repositórios clonados
- [ ] Reconfigurar webhooks
- [ ] Reconfigurar deploy keys
- [ ] Atualizar CI/CD pipelines
- [ ] Atualizar secrets e variáveis de ambiente
- [ ] Atualizar documentação com novos links
- [ ] Notificar equipe sobre a transferência
- [ ] Verificar integrações de terceiros
</details>

### Atualizar Remotes Locais

```bash
# Para cada repositório clonado localmente
cd [nome-do-repo]
git remote set-url origin https://github.com/NEO-FlowOFF/[nome-do-repo].git
git remote -v  # Verificar
```

### Script para Atualizar Todos

```bash
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

for repo in "${repos[@]}"; do
  if [ -d "$repo" ]; then
    echo "Atualizando $repo..."
    cd "$repo"
    git remote set-url origin "https://github.com/NEO-FlowOFF/$repo.git"
    cd ..
  fi
done
```

## 📚 Documentação Externa

- [GitHub API - Transfer Repository](https://docs.github.com/en/rest/repos/repos#transfer-a-repository)
- [GitHub Docs - Transferring a Repository](https://docs.github.com/pt/repositories/creating-and-managing-repositories/transferring-a-repository)
- [GitHub - Personal Access Tokens](https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

## 🐛 Troubleshooting Comum

<details>
<summary><strong>Token não encontrado</strong></summary>

**Sintomas:**
```
❌ Erro: Variável de ambiente GITHUB_TOKEN não configurada
```

**Soluções:**
1. Verificar se `~/.github-token` existe:
   ```bash
   ls -la ~/.github-token
   ```

2. Verificar variável de ambiente:
   ```bash
   echo $GITHUB_TOKEN
   echo $GITHUB_PAT
   ```

3. Criar arquivo de token:
   ```bash
   echo "GITHUB_TOKEN=seu_token_aqui" > ~/.github-token
   chmod 600 ~/.github-token
   ```
</details>

<details>
<summary><strong>Erro 403 (Forbidden)</strong></summary>

**Sintomas:**
```
⚠️  [repo] - Sem permissão (verifique o token)
```

**Causas possíveis:**
- Token sem permissões suficientes
- Token associado à conta errada
- Sem acesso de administrador na organização

**Soluções:**
1. Executar diagnóstico:
   ```bash
   node check-github-access.js
   ```

2. Verificar permissões do token em [GitHub Settings](https://github.com/settings/tokens)

3. Criar novo token com permissões:
   - ✅ `repo` (todos)
   - ✅ `admin:org` (todos)
</details>

<details>
<summary><strong>Erro 404 (Not Found)</strong></summary>

**Sintomas:**
```
⚠️  [repo] não encontrado ou sem permissão
```

**Causas possíveis:**
- Repositório não existe
- Nome incorreto (case-sensitive)
- Sem permissões de acesso

**Soluções:**
1. Verificar se repositório existe:
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/neomello/[nome-do-repo]
   ```

2. Verificar nome exato (GitHub é case-sensitive)

3. Verificar permissões de acesso ao repositório
</details>

<details>
<summary><strong>Erro 307 (Redirect Permanente)</strong></summary>

**Sintomas:**
```
❌ [repo] - Erro: 307
   Resposta: {"message":"Moved Permanently"}
```

**Causa:**
- Repositório já foi transferido anteriormente

**Solução:**
- ✅ Script trata automaticamente este erro
- ✅ Verifica status antes de tentar transferir
- ✅ Não é necessário ação manual
</details>

<details>
<summary><strong>Rate Limiting</strong></summary>

**Sintomas:**
```
❌ API rate limit exceeded
```

**Soluções:**
1. O script já inclui delay de 1 segundo entre requisições
2. Aguardar alguns minutos e tentar novamente
3. Verificar limite atual:
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/rate_limit
   ```
</details>

## 📅 Histórico

- **2025-01-27**: Criação dos scripts e transferência inicial dos 9 repositórios
- **2025-01-27**: Configuração de token e documentação completa

