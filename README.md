# HomeSync+ 🏠✨

![Status](https://img.shields.io/badge/Status-Development-blue) ![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-magenta) ![Voice](https://img.shields.io/badge/Voice-Live%20API-red)

**HomeSync+** (Async+) é um assistente doméstico inteligente de última geração que vai além dos comandos simples. Ele entende o contexto da sua casa, ajuda a organizar finanças, gerencia tarefas e cuida da saúde da família através de uma interface de voz fluida e natural.

## 🌟 Funcionalidades Principais

### 🧠 Inteligência Artificial (Powered by Google Gemini)
- **Voz em Tempo Real (Live API):** Converse com a Async+ como se fosse uma pessoa real. Ela ouve, pensa e responde instantaneamente com entonação humana.
- **Modos de Estado:** Visualização dinâmica dos estados da IA: 😴 Dormindo, 👂 Ouvindo, ⚡ Pensando, ✨ Falando.
- **Multimodalidade:** Interação via voz e chat de texto rico.

### 🏠 Gestão Doméstica
- **Dashboard Central:** Visão geral do saldo, tarefas pendentes e alertas.
- **Finanças:** Controle de orçamento e gastos.
- **Tarefas & Rotina:** Criação e gerenciamento de afazeres diários.
- **Compras & Inventário:** Lista de compras inteligente e controle de estoque (geladeira).
- **Gestão Familiar:** Agenda compartilhada e simulação de contatos/lembretes.

### ❤️ Saúde & Bem-estar (Módulos Especializados)
- **Nutricionista IA:** Criação de planos alimentares e análise de receitas.
- **Personal Trainer IA:** Sugestão de treinos e acompanhamento físico.
- **Essência:** Mensagens diárias de motivação e bem-estar emocional.

## 🛠️ Stack Tecnológica

- **Frontend:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **IA & SDK:** [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
  - Modelos: `gemini-2.5-flash` (Texto) & `gemini-2.5-flash-native-audio-preview` (Voz/Live)
- **Áudio:** Web Audio API (Processamento PCM raw em tempo real)

## 🚀 Como Rodar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/homesync-plus.git
   cd homesync-plus
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a API Key:**
   Crie um arquivo `.env` na raiz do projeto e adicione sua chave do Google AI Studio:
   ```env
   VITE_API_KEY=sua_chave_aqui_AIzaSy...
   ```
   *(Nota: Se estiver rodando no Google AI Studio, a chave é injetada automaticamente)*

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📦 Deploy

Este projeto está otimizado para deploy na **Vercel** ou **Netlify**.
Lembre-se de configurar a variável de ambiente `API_KEY` no painel da sua hospedagem.

---

Desenvolvido com 💙 e IA.
