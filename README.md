# BarberGuide Frontend (Angular)

Interface de usuário moderna e reativa para um sistema de agendamentos de barbearias e cabeleleiros, desenvolvida com a arquitetura Standalone do Angular 19. Este projeto demonstra a construção de uma Single Page Application (SPA) complexa, com gerenciamento de estado profissional, uma suíte de testes abrangente e UI construída com Tailwind CSS.

---

### 🎬 Aplicação em Funcionamento

![Image](https://github.com/user-attachments/assets/6ec82a9f-b350-4534-811a-9e3ca7ea68e4)

---

### 📋 Tabela de Conteúdos
1.  [Sobre o Projeto](#-sobre-o-projeto)
2.  [Principais Habilidades Demonstradas](#-principais-habilidades-demonstradas)
3.  [Decisões de Arquitetura](#-decisões-de-arquitetura)
4.  [Tech Stack](#-tech-stack)
5.  [Como Executar Localmente](#-como-executar-localmente)
6.  [Rodando os Testes](#-rodando-os-testes)
7.  [Próximos Passos](#-próximos-passos)

---

### ✨ Sobre o Projeto

Este frontend consome a [BarberGuide API](https://github.com/bribinha/barberguide-api) para fornecer uma experiência de usuário fluida e interativa para agendar horários com profissionais. O projeto foi estruturado com foco em escalabilidade, manutenibilidade e nas práticas mais modernas do ecossistema Angular.

### 🚀 Principais Habilidades Demonstradas

* **Arquitetura Standalone (Angular 19):** Aplicação construída 100% com a nova API de componentes, diretivas e pipes standalone, utilizando `provide` functions para configuração.
* **Gerenciamento de Estado com NgRx:** Implementação do padrão Redux com NgRx para um estado global previsível e de fácil depuração.
    * **Store:** Fonte única da verdade.
    * **Actions & Reducers:** Para transições de estado imutáveis e explícitas.
    * **Effects:** Para isolar efeitos colaterais (chamadas de API).
* **Testes Abrangentes (TDD):** Cobertura de testes completa com Jasmine e Karma, demonstrando uma abordagem de desenvolvimento focada em qualidade.
    * **Testes Unitários de Serviço:** Utilizando `HttpClientTestingModule` e mocks.
    * **Testes de Componentes:** Verificando renderização, interação do usuário (`fakeAsync`, `tick`) e aplicação de classes CSS.
    * **Testes de Navegação:** Garantindo que o roteamento se comporta como esperado com `RouterTestingModule`.
* **UI Moderna com Tailwind CSS:** Construção de uma interface responsiva e customizada utilizando o framework utility-first Tailwind CSS.
* **Serviços Reutilizáveis e UX:** Criação de serviços desacoplados para funcionalidades de UI, como diálogos de confirmação e notificações de toast, melhorando a experiência do usuário.
* **Padrões Avançados de RxJS:** Uso de operadores como `switchMap`, `finalize`, `filter`, `map` e `catchError` para gerenciar fluxos de dados assíncronos de forma robusta.

### 🏛️ Decisões de Arquitetura

* **Por que NgRx?** Para centralizar o estado da aplicação, tornando-a mais previsível e fácil de depurar com ferramentas como o Redux DevTools. Essencial para a escalabilidade do projeto.
* **Por que Standalone?** Para alinhar o projeto com as práticas mais modernas do Angular, resultando em um código menos verboso e builds mais otimizados.
* **Por que `data-testid` nos Testes?** Para desacoplar os testes da implementação de estilos (classes CSS), tornando-os mais robustos e resistentes a mudanças na UI.

### 🛠️ Tech Stack

* **Angular 19** (Standalone)
* **TypeScript**
* **NgRx** (Store, Effects, StoreDevtools)
* **RxJS**
* **Tailwind CSS**
* **Jasmine & Karma** (Testes)

### ⚙️ Como Executar Localmente

**Pré-requisitos:**
* Node.js >= 20.x
* NPM ou Yarn
* Angular CLI
* **A [BarberGuide API](https://github.com/bribinha/barberguide-api) deve estar rodando localmente.**

**Passos:**
1.  Clone o repositório: `git clone https://github.com/bribinha/barberguide-frontend`
2.  Navegue até a pasta: `cd booking-system-frontend`
3.  Instale as dependências: `npm install`
4.  Inicie o servidor de desenvolvimento: `npm start`
    * A aplicação estará disponível em `http://localhost:4200`

### 🧪 Rodando os Testes

Para executar a suíte de testes completa, rode:
```bash
ng test
```

###  🔮 Próximos Passos
* **[ ] Implementação das telas e fluxo de Autenticação (login, register).**
* **[ ] Criação de um AuthService e AuthGuard para proteger rotas.**
* **[ ] Página "Meus Agendamentos" para o cliente.**
* **[ ] Dashboard de gerenciamento de agenda para o profissional.**
* **[ ] Refatoração do fluxo de agendamento para usar o estado do NgRx.**
* **[ ] Deploy na Vercel/Netlify.**
