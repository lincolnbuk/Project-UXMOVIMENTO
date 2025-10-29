## UxMovimento — Build e Play Store

Este README curto descreve como gerar um AAB assinado e os passos rápidos para testar em dispositivo e enviar ao Play Console.

Local do projeto

- Raiz do projeto: `c:\Users\lincoln\Desktop\UxMovimento`
- Android: `android/`

Keystore (já criado localmente para este repositório)

- Arquivo: `android/release-key.keystore`
- Credenciais: `android/keystore.properties` (não versionado por padrão — cuidado ao commitar)

Gerar AAB assinado (build já testado neste repositório)

1. Abra um terminal (PowerShell) na pasta do projeto e rode:

```powershell
cd 'c:\Users\lincoln\Desktop\UxMovimento\android'
.\gradlew.bat clean bundleRelease --no-daemon --info
```

2. Artefato gerado (exemplo):

- `android/app/build/outputs/bundle/release/app-release.aab` (ou `intermediary-bundle.aab`)

Transformar AAB em APKs instaláveis (opcional — usa bundletool)

1. Baixe o bundletool.jar: https://github.com/google/bundletool/releases
2. Crie APKS a partir do AAB:

```powershell
# ajuste senhas conforme seu keystore
java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app-release.apks --ks=../release-key.keystore --ks-pass=pass:<STORE_PASS> --ks-key-alias=upload --key-pass=pass:<KEY_PASS>

# instala no dispositivo conectado (USB)
java -jar bundletool.jar install-apks --apks=app-release.apks
```

Testar localmente (debug)

```powershell
# instala o app em modo debug no dispositivo/emulador
npx react-native run-android
```

Gerar e instalar APK release (alternativa direta)

```powershell
cd android
.\gradlew.bat assembleRelease
# depois instale (dispositivo conectado)
.\gradlew.bat installRelease
```

Notas importantes

- O `android/app/build.gradle` atualmente contém um fallback temporário para Java 17 (compileOptions + toolchain + kotlin jvmTarget = 17) para compatibilidade com módulos nativos. O build release foi verificado e gerou um AAB assinado.
- Próximo passo (recomendado): migrar tudo para Java 21 e remover o fallback; isso exige ajustar/atualizar módulos nativos ou aplicar patches temporários.

Se quiser que eu faça a migração completa para Java 21 (remover fallback e corrigir quaisquer módulos), responda "Continuar migração" — eu faço a inspeção e aplico patches/PRs necessários.

Local de saída do build

- `android/app/build/outputs/bundle/release`

Suporte

- Se quiser que eu gere o README completo para Play Store (texto para o console, notas de release, changelog), aviso e eu adiciono.

---

README criado automaticamente pelo assistente para preparar o AAB e publicar no Play Store.

# UxMovimento

![React Native Logo](https://reactnative.dev/img/header_logo.svg)

**PT-BR:**

Aplicativo React Native para conexão entre corredores, com autenticação via Firebase, chat, gamificação e pareamento. Estruturado em MVVM, com navegação stack, tela de login moderna e integração completa com Firebase Auth.

**EN:**

React Native app to connect runners, with Firebase authentication, chat, gamification and matching. MVVM structure, stack navigation, modern login screen and full Firebase Auth integration.

---

## Histórico de Evolução / Changelog

- [x] **Cadastro e edição de perfil do usuário:**
  - Model `UserProfile` com nome, pace, localização, frequência, objetivos.
  - ViewModel `ProfileViewModel` com integração ao Firestore (`users`).
  - Tela `ProfileView` para exibir e editar dados do usuário.
  - Redirecionamento automático para perfil após login se perfil estiver incompleto.
- [x] **Integração Firestore:**
  - Instalação e uso de `@react-native-firebase/firestore`.
  - Importação com `// @ts-ignore` para evitar erros de tipagem.
- [x] **Boas práticas de tipagem:**
  - Uso de `UserProfile | null` para estados assíncronos.
  - Tipagem explícita em parâmetros de função.
  - Uso de `any` em blocos `catch` para tratamento genérico de erros.
- [x] **Navegação stack:**
  - Adição da tela de perfil à navegação principal (`App.tsx`).
  - Navegação condicional para `Profile` ou `Match` após login.
- [x] **Documentação e README atualizados**

---

## Status do Projeto / Project Status

- [x] Estrutura MVVM para autenticação, match, chat e gamificação
- [x] Navegação stack com React Navigation
- [x] Tela de login estilizada (azul claro, nome do app, botão animado)
- [x] Autenticação real com Firebase Auth
- [x] Integração Firebase Android (google-services.json, build.gradle)
- [x] Correção de erros de tipagem/importação
- [x] Testes de build, cache, reinstalação e execução
- [x] Remoção de arquivos de exemplo
- [x] Login funcional no app Android
- [x] Cadastro e edição de perfil com Firestore
- [ ] Chat, gamificação, pareamento avançado, logout, recuperação de senha

---

## Como rodar o projeto / How to run the project

### 1. Instale as dependências / Install dependencies

```sh
npm install
```

### 2. Configure o Firebase / Configure Firebase

- Adicione o arquivo `google-services.json` em `android/app/` (obtido no console do Firebase).
- Verifique se o build.gradle está configurado conforme a documentação do Firebase.

### 3. Rode o Metro Bundler / Start Metro Bundler

```sh
npx react-native start --reset-cache
```

### 4. Rode o app no Android / Run the app on Android

```sh
npx react-native run-android
```

### 5. Login

- Crie um usuário no console do Firebase Authentication (e-mail/senha) e use para login no app.

---

## Próximos Passos / Next Steps

**PT-BR:**

1. Fluxo de cadastro de usuário
2. Tela de pareamento/match entre corredores
3. Chat entre usuários (Firebase Firestore)
4. Sistema de gamificação (pontos, conquistas, ranking)
5. Tela de perfil do usuário
6. Logout e recuperação de senha
7. Aprimorar UI/UX (animações, feedbacks, splash screen)
8. Testes em múltiplos dispositivos

**EN:**

1. User sign up flow
2. Matching screen for runners
3. User chat (Firebase Firestore)
4. Gamification system (points, achievements, ranking)
5. User profile screen
6. Logout and password recovery
7. Improve UI/UX (animations, feedback, splash screen)
8. Testing on multiple devices

---

## Estrutura do Projeto / Project Structure

- `App.tsx`: Entry point, navigation setup
- `src/models/`: Modelos de dados / Data models
- `src/viewmodels/`: Lógica de negócio (MVVM) / Business logic (MVVM)
- `src/views/`: Telas e componentes visuais / Screens and UI components
- `android/`: Projeto nativo Android / Native Android project
- `ios/`: Projeto nativo iOS / Native iOS project

---

## Documentação Original React Native / Original React Native Docs

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

---

## Troubleshooting

Se tiver problemas, veja a [página de troubleshooting](https://reactnative.dev/docs/troubleshooting) ou envie a mensagem de erro para análise.

If you have issues, check the [troubleshooting page](https://reactnative.dev/docs/troubleshooting) or send the error message for analysis.
