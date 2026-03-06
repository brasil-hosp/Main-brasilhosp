# 🏥 Brasil Hosp Site: Portal Institucional e Catálogo

> **Status:** Em Produção | **Arquitetura:** SPA React (Frontend) + Supabase (Backend/Auth) | **Design:** Premium Corporate Identity

## 🎯 O Problema
Apresentar as soluções, estrutura e o catálogo de produtos da Brasil Hosp de forma moderna, responsiva, e com elementos de design de alto padrão (Premium), transmitindo confiança e tecnologia para clientes do setor da saúde.

## 💡 A Solução: Brasil Hosp Site
Uma plataforma web completa e veloz que serve como portal da empresa, oferecendo a apresentação dos serviços (Locação, Manutenção, Calibração, Engenharia Clínica) e um catálogo interativo de equipamentos médicos-hospitalares, com suporte a orçamentos e painel administrativo. 

---

## 🏗️ Arquitetura de Software

O sistema adota uma arquitetura em duas camadas (Frontend SPA e Backend as a Service):

1. **Frontend (`React + Vite + TypeScript`)**: Interface de usuário rica, construída com Tailwind CSS e shadcn/ui. Foco na acessibilidade e velocidade.
2. **State & Data Management (`TanStack Query`)**: Gerenciamento de estado de servidor e cache eficiente, entregando dados atualizados.
3. **Backend & Auth (`Supabase`)**: Banco de dados PostgreSQL com API auto-gerada, autenticação nativa e regras de segurança (RLS - Row Level Security).

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologias Principais |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, shadcn-ui, Lucide (Icons) |
| **Roteamento** | React Router DOM |
| **Backend / DB** | Supabase (PostgreSQL, Auth, Storage) |
| **Data Fetching**| TanStack Query (@tanstack/react-query) |
| **Componentes** | Radix UI |

---

## 🚀 Guia de Uso (Deploy Local)

### Pré-requisitos
- Node.js e npm (ou nvm) instalados

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/brasil-hosp/Main-brasilhosp.git
   cd Main-brasilhosp
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse:**
   - **Frontend:** `http://localhost:8080` (A porta exata aparecerá no terminal, padrão Vite)
