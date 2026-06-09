# 📱 Books App

Aplicativo mobile para gerenciamento de livros, construído com React Native e Expo. Consome a [Books API](../books-api) via requisições HTTP e oferece uma interface simples para listar, criar, editar e deletar livros.

## 🛠️ Tecnologias

- **React Native 0.81**
- **Expo SDK 54**
- **React 19**

## 📁 Estrutura do projeto

```
books-app/
├── App.js           # Componente principal com toda a lógica e UI
├── index.js         # Ponto de entrada (registerRootComponent)
├── app.json         # Configuração do Expo
├── package.json
└── README.md
```

## 🚀 Como rodar

### Pré-requisitos

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`) ou uso via `npx`
- [Books API](../books-api) rodando localmente

### Instalação e execução

```bash
npm install
npx expo start
```

Escaneie o QR Code com o aplicativo **Expo Go** (iOS/Android) ou pressione:
- `a` para abrir no emulador Android
- `i` para abrir no simulador iOS
- `w` para abrir no navegador

### ⚙️ Configuração da URL da API

No arquivo `App.js`, ajuste a constante `API_URL` para o IP da sua máquina na rede local:

```js
// App.js
const API_URL = 'http://SEU_IP_LOCAL:3000';
```

> **Por que isso é necessário?** Em dispositivos físicos, `localhost` aponta para o próprio celular, não para o computador. Use o IP da sua máquina na rede Wi-Fi (ex.: `192.168.1.100`). Em emuladores Android, use `10.0.2.2`.

## 🖥️ Funcionalidades

- **Listar livros** — exibe todos os livros cadastrados ao abrir o app
- **Adicionar livro** — abre um modal com campos de título, autor e ano
- **Editar livro** — pré-preenche o modal com os dados do livro selecionado
- **Deletar livro** — solicita confirmação antes de remover
- **Feedback de carregamento** — indicador visual durante as requisições

## 📦 Dependências principais

| Pacote             | Versão     | Uso                          |
|--------------------|------------|------------------------------|
| `expo`             | `~54.0.34` | Plataforma base              |
| `react-native`     | `0.81.5`   | Framework UI                 |
| `react`            | `19.1.0`   | Biblioteca de componentes    |
| `expo-status-bar`  | `~3.0.9`   | Controle da barra de status  |

## 📋 Pré-requisitos para contribuir

```bash
# Verificar a versão do Node
node -v  # >= 18

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npx expo start
```
