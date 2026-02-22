# Gym App

Aplicativo mobile para gerenciamento de academias, desenvolvido com **React Native** + **Expo** (Expo Router).

---

## Visão Geral

O app suporta quatro perfis de usuário com fluxos distintos:

| Perfil | Acesso |
|---|---|
| `super` | Gerenciamento global de academias e usuários |
| `admin` | Administração de usuários, treinos, dietas e produtos da academia |
| `personal` | Gestão de treinos e dietas dos alunos |
| `user` (aluno) | Visualização de treinos, dietas e loja |

Novos usuários passam por um fluxo de aprovação antes de acessar o app.

---

## Tecnologias

- **React Native** 0.76 + **Expo** SDK 52
- **Expo Router** (file-based routing)
- **TypeScript**
- **Context API** — autenticação e tema
- **AsyncStorage** — persistência do token JWT
- **EAS Build** — builds de produção (Android/iOS)

---

## Pré-requisitos

- Node.js ≥ 18
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- API backend rodando em `http://localhost:3333` (ver variável em `constants/environment.ts`)

---

## Instalação

```bash
# Clone o repositório
git clone <url-do-repo>
cd gym

# Instale as dependências
npm install
```

---

## Executando

```bash
# Iniciar o Metro Bundler (Expo Dev Client)
npx expo start

# Android
npx expo run:android

# iOS
npx expo run:ios
```

---

## Estrutura do Projeto

```
app/               → Telas (Expo Router file-based routing)
  (admin)/         → Telas exclusivas de administrador
  (personal)/      → Telas do personal trainer
  (client)/        → Telas do aluno
  (auth)/          → Login e cadastro
components/        → Componentes reutilizáveis
  admin/           → Cards e listagens para admin
  common/          → Componentes compartilhados entre perfis
constants/         → Configurações globais (API endpoints, cores, etc.)
context/           → Providers React (auth, tema)
hooks/             → Custom hooks (useApi, useAuth, useTrainings, etc.)
interfaces/        → Tipos TypeScript dos modelos de domínio
services/          → Camada de acesso à API (apiService, userService, etc.)
styles/            → Estilos globais e tema escuro
utils/             → Utilitários (formatação de datas, notificações, guards)
```

---

## Variáveis de Ambiente

Edite `constants/environment.ts` para apontar para a API correta:

```ts
export const API_BASE_URL = 'http://SEU_IP:3333'
```

> Em dispositivos físicos, use o IP da máquina na rede local em vez de `localhost`.

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npx expo start` | Inicia o servidor de desenvolvimento |
| `npx expo run:android` | Build e execução no Android |
| `npx expo run:ios` | Build e execução no iOS |
| `npx tsc --noEmit` | Verificação de tipos TypeScript |
| `npx eas build` | Build de produção via EAS |

---

## Tratamento de Erros de API

O app realiza tratamento automático dos seguintes códigos HTTP:

| Código | Comportamento |
|---|---|
| `401` | Sessão expirada → logout automático + alerta |
| `403` | Permissão negada → alerta informativo |
| `422` | Erros de validação → lista campos inválidos |
| `0` | Sem conexão → alerta de rede |
| `4xx/5xx` | Mensagem amigável em PT-BR |

---

## Fluxo de Autenticação

1. Usuário faz cadastro → status `pendente`
2. Admin/Personal aprova o cadastro
3. Usuário recebe acesso conforme seu perfil (`admin`, `personal`, `user`)
4. Token JWT é armazenado via `AsyncStorage` e renovado automaticamente
