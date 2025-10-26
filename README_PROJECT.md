# README - UxMovimento (Android build & Play Store quick guide)

Este README descreve os passos mínimos para gerar um AAB assinado pronto para upload ao Google Play, usando a configuração atual do projeto.

Pré-requisitos

- Node.js (versão compatível com React Native 0.80.0)
- npm
- Java JDK (Gradle toolchain pode baixar automaticamente se `org.gradle.java.installations.auto-download=true` estiver em `android/gradle.properties`)
- Android SDK + Android SDK Platform (compileSdk selecionado no projeto)
- Android NDK (versão especificada em `android/build.gradle` / `rootProject.ext.ndkVersion`)
- keytool (JDK) para gerar keystore

Arquivos importantes

- `android/release-key.keystore` - keystore local (não comitado por segurança em repositórios públicos)
- `android/keystore.properties` - arquivo que aponta para o keystore e contém passwords (ex.: `storeFile=../release-key.keystore`)
- `android/app/build.gradle` - configura o signingConfig para `release`

Gerar keystore (se ainda não tiver)

1. Abra um terminal no diretório `android`.
2. Rode (substitua senhas e DN conforme desejar):

```powershell
keytool -genkeypair -v -keystore release-key.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000 -storepass "SUA_STORE_PASS" -keypass "SUA_KEY_PASS" -dname "CN=UxMovimento, OU=Dev, O=UxMovimento, L=City, ST=State, C=BR"
```

3. Edite `android/keystore.properties` e insira:

```
storeFile=../release-key.keystore
storePassword=SUA_STORE_PASS
keyAlias=upload
keyPassword=SUA_KEY_PASS
```

Observação: `storeFile` aponta para `../release-key.keystore` porque o Gradle lerá esse arquivo a partir do diretório `android`.

Gerar AAB assinado

1. Do diretório `android`, execute:

```powershell
./gradlew.bat clean bundleRelease --no-daemon --info
```

2. Artefato gerado: `android/app/build/outputs/bundle/release/app-release.aab` (assinado com o keystore configurado).

Dicas de debug rápidas

- Se o Gradle reclamar de senha incorreta durante a tarefa `signReleaseBundle`, verifique as senhas em `android/keystore.properties` e o caminho `storeFile`.
- Mensagens sobre "Inconsistent JVM-target" geralmente indicam mismatch entre `kotlinOptions.jvmTarget` e as opções Java; por enquanto o projeto usa Java 17 no módulo `app` como fallback.
- Mensagens sobre variantes/consumable components para módulos nativos (`No matching variant of project :... was found`) significam que algum módulo não está expondo variantes compatíveis. Podemos aplicar patches locais com `patch-package` ou atualizar a dependência.

Próximos passos (opcionais)

- Remover fallback para Java 17 e migrar todo o projeto para Java 21 (recomendado a médio prazo).
- Investigar e corrigir publicação de variantes dos módulos nativos para evitar workarounds em `app/build.gradle`.
- Criar CI que execute `./gradlew bundleRelease` e salve o AAB em um artefato.

Se quiser, eu posso gerar um `PLAYSTORE_CHECKLIST.md` com o checklist passo-a-passo para upload e criar instruções para o Play Console (incluindo App signing by Google Play).
