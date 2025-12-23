# ✅ Checklist Pós-Transferência

Este documento lista todas as tarefas que devem ser realizadas após transferir repositórios para a organização **NEO-FlowOFF**.

## 📋 Status das Tarefas

- [ ] **Atualizar remotes locais** - Ver seção abaixo
- [ ] **Reconfigurar webhooks** - Ver seção abaixo
- [ ] **Reconfigurar deploy keys** - Ver seção abaixo
- [ ] **Atualizar CI/CD pipelines** - Verificar configurações
- [ ] **Atualizar secrets e variáveis** - Verificar GitHub Secrets
- [ ] **Atualizar documentação** - Links e referências
- [ ] **Notificar equipe** - Informar sobre a transferência

---

## 🔄 1. Atualizar Remotes Locais

### Método Automatizado (Recomendado)

Execute o script fornecido:

```bash
cd ~/github-scripts
./update-remotes.sh
```

O script irá:
- ✅ Procurar repositórios clonados localmente
- ✅ Verificar remotes atuais
- ✅ Atualizar para a nova organização
- ✅ Gerar relatório de atualizações

### Método Manual

Para cada repositório clonado localmente:

```bash
cd [nome-do-repo]

# Verificar remote atual
git remote -v

# Atualizar para HTTPS
git remote set-url origin https://github.com/NEO-FlowOFF/[nome-do-repo].git

# OU atualizar para SSH
git remote set-url origin git@github.com:NEO-FlowOFF/[nome-do-repo].git

# Verificar se foi atualizado
git remote -v

# Sincronizar
git fetch
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
    git fetch
    cd ..
  fi
done
```

---

## 🔗 2. Reconfigurar Webhooks

> **⚠️ Importante**
> Webhooks não são transferidos automaticamente. Eles precisam ser recriados na nova organização.

### Verificar Webhooks Existentes

1. Acesse cada repositório na organização: `https://github.com/NEO-FlowOFF/[nome-do-repo]`
2. Vá em **Settings** → **Webhooks**
3. Verifique se há webhooks configurados

### Criar Novos Webhooks

Para cada webhook necessário:

1. Acesse: `https://github.com/NEO-FlowOFF/[nome-do-repo]/settings/hooks`
2. Clique em **"Add webhook"**
3. Configure:
   - **Payload URL**: URL do seu serviço
   - **Content type**: `application/json` ou `application/x-www-form-urlencoded`
   - **Secret**: Chave secreta (se necessário)
   - **Events**: Selecione eventos desejados
4. Clique em **"Add webhook"**

### Webhooks Comuns

- **CI/CD**: GitHub Actions, Jenkins, CircleCI, etc.
- **Notificações**: Slack, Discord, Email
- **Deploy**: Servidores de produção/staging
- **Integrações**: Jira, Trello, etc.

### Script para Listar Webhooks (via API)

```bash
# Requer GITHUB_TOKEN configurado
export GITHUB_TOKEN=$(cat ~/.github-token | grep GITHUB_TOKEN= | cut -d'=' -f2)

for repo in flwff_dao flowcloser-agent flowpay_lite flowcloser flowpay_landing agent-neo-flowoff flow25 evolution-flow flowoffmkt; do
  echo "📦 $repo:"
  curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/NEO-FlowOFF/$repo/hooks" | \
    jq -r '.[] | "  - \(.name // "unnamed"): \(.config.url)"'
  echo ""
done
```

---

## 🔑 3. Reconfigurar Deploy Keys

> **⚠️ Importante**
> Deploy keys não são transferidas automaticamente. Elas precisam ser recriadas.

### Verificar Deploy Keys Existentes

1. Acesse cada repositório: `https://github.com/NEO-FlowOFF/[nome-do-repo]`
2. Vá em **Settings** → **Deploy keys**
3. Verifique se há deploy keys configuradas

### Criar Nova Deploy Key

#### 1. Gerar Chave SSH (se necessário)

```bash
# No servidor que precisa acessar o repositório
ssh-keygen -t ed25519 -C "deploy-key-para-[nome-do-repo]"
# Salve em: ~/.ssh/id_ed25519_deploy_[nome-do-repo]

# Copiar chave pública
cat ~/.ssh/id_ed25519_deploy_[nome-do-repo].pub
```

#### 2. Adicionar no GitHub

1. Acesse: `https://github.com/NEO-FlowOFF/[nome-do-repo]/settings/keys`
2. Clique em **"Add deploy key"**
3. Cole a chave pública
4. Dê um título descritivo
5. Marque **"Allow write access"** se necessário
6. Clique em **"Add key"**

#### 3. Configurar no Servidor

```bash
# Adicionar ao SSH config
cat >> ~/.ssh/config << EOF
Host github-deploy-[nome-do-repo]
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_deploy_[nome-do-repo]
    IdentitiesOnly yes
EOF

# Atualizar remote para usar a chave específica
cd [diretório-do-repo]
git remote set-url origin git@github-deploy-[nome-do-repo]:NEO-FlowOFF/[nome-do-repo].git
```

### Script para Adicionar Deploy Key via API

```bash
# Requer GITHUB_TOKEN configurado
export GITHUB_TOKEN=$(cat ~/.github-token | grep GITHUB_TOKEN= | cut -d'=' -f2)

REPO="nome-do-repo"
TITLE="Deploy Key - Servidor Produção"
KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5..." # Sua chave pública

curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/NEO-FlowOFF/$REPO/keys" \
  -d "{
    \"title\": \"$TITLE\",
    \"key\": \"$KEY\",
    \"read_only\": false
  }"
```

---

## ⚙️ 4. Atualizar CI/CD Pipelines

### GitHub Actions

Verifique arquivos `.github/workflows/*.yml` em cada repositório:

```yaml
# Antes
on:
  push:
    branches: [ main ]
    repository: neomello/[nome-do-repo]

# Depois (geralmente não precisa mudar, mas verifique)
on:
  push:
    branches: [ main ]
    # repository agora é NEO-FlowOFF/[nome-do-repo]
```

### Outros CI/CD

- **Jenkins**: Atualizar URLs dos repositórios
- **CircleCI**: Atualizar configurações de projeto
- **GitLab CI**: Se usar integração externa
- **Vercel/Netlify**: Atualizar conexões de repositório

---

## 🔐 5. Atualizar Secrets e Variáveis

### GitHub Secrets

1. Acesse cada repositório: `https://github.com/NEO-FlowOFF/[nome-do-repo]`
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Verifique se todos os secrets estão configurados
4. Adicione novos secrets se necessário

### Secrets da Organização

Se você usa secrets da organização:

1. Acesse: `https://github.com/organizations/NEO-FlowOFF/settings/secrets/actions`
2. Verifique se os secrets necessários estão disponíveis
3. Configure acesso por repositório se necessário

### Variáveis de Ambiente

Para GitHub Actions, verifique:
- Repository variables
- Organization variables
- Environment variables

---

## 📝 6. Atualizar Documentação

### Links Internos

Atualize referências nos repositórios:

- README.md
- Documentação
- Links em código
- Comentários

### Exemplo de Busca

```bash
# Procurar links antigos
grep -r "github.com/neomello" [diretório-do-repo]/

# Substituir (cuidado!)
find [diretório-do-repo] -type f -name "*.md" -exec sed -i '' 's|github.com/neomello|github.com/NEO-FlowOFF|g' {} \;
```

---

## 📢 7. Notificar Equipe

### Checklist de Comunicação

- [ ] Notificar desenvolvedores sobre a transferência
- [ ] Atualizar documentação interna
- [ ] Atualizar links em documentação externa
- [ ] Informar sobre novos URLs
- [ ] Compartilhar checklist de atualizações

---

## ✅ Verificação Final

Execute este script para verificar o status:

```bash
# Verificar remotes
./update-remotes.sh

# Verificar webhooks (requer token)
# Use o script fornecido na seção de webhooks

# Verificar deploy keys
# Acesse manualmente cada repositório
```

---

## 🔗 Links Úteis

- [GitHub - Transferring a Repository](https://docs.github.com/pt/repositories/creating-and-managing-repositories/transferring-a-repository)
- [GitHub - Managing Webhooks](https://docs.github.com/pt/developers/webhooks-and-events/webhooks/about-webhooks)
- [GitHub - Managing Deploy Keys](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh/managing-deploy-keys)

---

**📅 Última atualização:** 2025-01-27

