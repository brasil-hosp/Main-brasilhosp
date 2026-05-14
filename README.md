# 🏥 Brasil Hosp — Portal Institucional, Catálogo e Gestão de Pedidos

> **Status:** Em Produção | **Arquitetura:** SPA React (Frontend) + Supabase (BaaS) | **Design:** Premium Corporate Identity

## 🎯 O Problema
Apresentar as soluções, estrutura e o catálogo de produtos da Brasil Hosp de forma moderna, responsiva, e com elementos de design de alto padrão (Premium), transmitindo confiança e tecnologia para clientes do setor da saúde — além de gerenciar pedidos de forma estruturada e escalável.

## 💡 A Solução
Uma plataforma web completa que serve como portal da empresa, oferecendo:

- **Institucional**: Apresentação dos serviços (Locação, Manutenção, Calibração, Engenharia Clínica)
- **Catálogo Interativo**: Equipamentos médicos-hospitalares com busca, filtros e favoritos
- **Sistema de Pedidos**: Formulário centralizado (`/pedido/:token`) com itens livres + catálogo, compartilhável via WhatsApp
- **Painel Administrativo**: Gestão de produtos, pedidos, clientes, e exportação CSV

---

## 🏗️ Arquitetura

O sistema segue uma arquitetura de **Monolito Modular** em duas camadas:

| Camada | Responsabilidade | Tecnologias |
| :--- | :--- | :--- |
| **Apresentação** | UI, páginas, componentes | React, Tailwind, shadcn/ui |
| **Aplicação** | Lógica de negócio, hooks | React Hooks, Context API |
| **Domínio** | Tipos e contratos | TypeScript interfaces |
| **Infraestrutura** | Persistência, APIs externas | Supabase (PostgreSQL, Auth, RLS) |

### Fluxo de Pedidos

```
┌─────────────┐   ┌──────────────┐   ┌───────────────────┐
│  Catálogo    │   │ Link Admin   │   │ Solicitar Orçam.  │
│  (carrinho)  │   │ (WhatsApp)   │   │ (form contato)    │
└──────┬───────┘   └──────┬───────┘   └───────────────────┘
       │                  │
       ▼                  ▼
┌─────────────────────────────────────┐
│   OrderForm /pedido/:token          │
│   • Digitar item livre              │
│   • Buscar no catálogo              │
│   • Auto-preenche se logado         │
│   • Confirmar e enviar              │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│   Painel Admin /admin               │
│   • Criar pedido + gerar link       │
│   • Gerenciar status                │
│   • Exportar CSV (geral/individual) │
└─────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons |
| **Roteamento** | React Router DOM |
| **Backend / DB** | Supabase (PostgreSQL, Auth, Storage, RLS) |
| **Data Fetching** | TanStack Query (@tanstack/react-query) |
| **Componentes** | Radix UI Primitives |
| **Deploy** | Vercel |

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── admin/          # OrderManager, ProductManager, etc.
│   ├── order/          # CatalogSearchModal
│   ├── FloatingCart.tsx # Carrinho flutuante simplificado
│   └── Navbar.tsx      # Navegação principal
├── pages/
│   ├── Index.tsx       # Landing page
│   ├── Catalog.tsx     # Catálogo de produtos
│   ├── OrderForm.tsx   # Formulário de pedido (full-screen)
│   └── Admin.tsx       # Painel administrativo
├── services/
│   ├── orderService.ts # CRUD de pedidos
│   └── productService.ts
├── types/              # TypeScript interfaces
├── context/            # CartContext, AuthContext
└── lib/
    └── supabase.ts     # Cliente Supabase
```

---

## 🔒 Segurança

- **RLS (Row Level Security)** ativo em todas as tabelas do Supabase
- **Variáveis de ambiente** protegidas via `.env` (excluído do git)
- **Chave Supabase** é do tipo `anon/publishable` (pública por design)
- **Tokens de pedido** únicos para acesso por link

---

## 🚀 Deploy Local

### Pré-requisitos
- Node.js 18+ e npm

### Instalação

```bash
git clone https://github.com/brasil-hosp/Main-brasilhosp.git
cd Main-brasilhosp
npm install
```

### Configuração

Crie um arquivo `.env` na raiz:
```env
VITE_SUPABASE_URL=<sua_url_supabase>
VITE_SUPABASE_ANON_KEY=<sua_chave_anon>
VITE_SHEETDB_API_URL=<url_sheetdb>
VITE_WHATSAPP_NUMBER=<numero_whatsapp>
```

### Executar

```bash
npm run dev
```

Acesse: `http://localhost:8080`
