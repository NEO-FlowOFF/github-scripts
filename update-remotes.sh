#!/bin/bash

# Script para atualizar remotes dos repositórios clonados localmente
# após transferência para a organização NEO-FlowOFF

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Lista de repositórios transferidos
REPOS=(
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

# Organização destino
ORG="NEO-FlowOFF"

# Diretórios comuns onde repositórios podem estar
SEARCH_DIRS=(
  "$HOME"
  "$HOME/Desktop"
  "$HOME/Documents"
  "$HOME/Downloads"
  "$HOME/Projects"
  "$HOME/Projetos"
)

echo "🔍 Procurando repositórios clonados localmente..."
echo ""

UPDATED=0
NOT_FOUND=0
ALREADY_UPDATED=0

# Função para atualizar remote
update_remote() {
  local repo_dir=$1
  local repo_name=$2
  
  cd "$repo_dir"
  
  # Verifica se é um repositório git
  if [ ! -d ".git" ]; then
    echo -e "${RED}❌ $repo_name: Não é um repositório Git${NC}"
    return 1
  fi
  
  # Obtém URL atual
  CURRENT_URL=$(git remote get-url origin 2>/dev/null || echo "")
  
  if [ -z "$CURRENT_URL" ]; then
    echo -e "${YELLOW}⚠️  $repo_name: Sem remote 'origin' configurado${NC}"
    return 1
  fi
  
  # Verifica se já está atualizado
  if echo "$CURRENT_URL" | grep -q "$ORG/$repo_name"; then
    echo -e "${GREEN}✅ $repo_name: Já está atualizado${NC}"
    echo "   URL: $CURRENT_URL"
    ((ALREADY_UPDATED++))
    return 0
  fi
  
  # Novo URL
  if echo "$CURRENT_URL" | grep -q "^git@"; then
    # SSH
    NEW_URL="git@github.com:$ORG/$repo_name.git"
  else
    # HTTPS
    NEW_URL="https://github.com/$ORG/$repo_name.git"
  fi
  
  # Atualiza remote
  echo -e "${YELLOW}🔄 $repo_name: Atualizando remote...${NC}"
  echo "   Antigo: $CURRENT_URL"
  echo "   Novo:   $NEW_URL"
  
  git remote set-url origin "$NEW_URL"
  
  # Verifica se foi atualizado
  VERIFIED_URL=$(git remote get-url origin)
  if echo "$VERIFIED_URL" | grep -q "$ORG/$repo_name"; then
    echo -e "${GREEN}✅ $repo_name: Remote atualizado com sucesso!${NC}"
    ((UPDATED++))
    return 0
  else
    echo -e "${RED}❌ $repo_name: Erro ao atualizar remote${NC}"
    return 1
  fi
}

# Procura repositórios
for repo in "${REPOS[@]}"; do
  FOUND=false
  
  # Procura em diretórios comuns
  for search_dir in "${SEARCH_DIRS[@]}"; do
    if [ -d "$search_dir/$repo" ]; then
      FOUND=true
      update_remote "$search_dir/$repo" "$repo"
      echo ""
      break
    fi
  done
  
  # Se não encontrou, procura recursivamente (limitado a 3 níveis)
  if [ "$FOUND" = false ]; then
    for search_dir in "${SEARCH_DIRS[@]}"; do
      FOUND_DIR=$(find "$search_dir" -maxdepth 3 -type d -name "$repo" -path "*/.git/.." 2>/dev/null | head -1)
      if [ -n "$FOUND_DIR" ]; then
        FOUND=true
        update_remote "$FOUND_DIR" "$repo"
        echo ""
        break
      fi
    done
  fi
  
  if [ "$FOUND" = false ]; then
    echo -e "${YELLOW}⚠️  $repo: Não encontrado localmente${NC}"
    ((NOT_FOUND++))
  fi
done

# Resumo
echo "=================================================="
echo "📊 RESUMO"
echo "=================================================="
echo -e "${GREEN}✅ Atualizados: $UPDATED${NC}"
echo -e "${GREEN}✅ Já atualizados: $ALREADY_UPDATED${NC}"
echo -e "${YELLOW}⚠️  Não encontrados: $NOT_FOUND${NC}"
echo "=================================================="

if [ $UPDATED -gt 0 ]; then
  echo ""
  echo "💡 Dica: Execute 'git fetch' em cada repositório atualizado para sincronizar:"
  echo "   cd [nome-do-repo] && git fetch"
fi

