Play Store Upload Checklist - UxMovimento

Use este checklist antes de enviar a AAB ao Google Play Console.

1. Versão e metadata

- Atualize `versionCode` e `versionName` em `android/app/build.gradle` (ou via gradle.properties/CI).
  - `versionCode` deve aumentar a cada upload.
  - `versionName` é o texto visível aos usuários.
- Verifique `applicationId` em `android/app/build.gradle`.

2. Assinatura do app

- Tenha o keystore (arquivo `.keystore`) e as credenciais:
  - `storeFile`, `storePassword`, `keyAlias`, `keyPassword` em `android/keystore.properties`.
- Se for usar "App signing by Google Play" (recomendado): forneça a chave de upload (a mesma do keystore criado) quando solicitado.

3. Gerar AAB (release)

- No diretório `android` execute:

```powershell
./gradlew.bat clean bundleRelease --no-daemon
```

- Verifique o arquivo gerado:

```
android/app/build/outputs/bundle/release/app-release.aab
```

4. Testes locais

- Instale o AAB em um dispositivo via internal testing (upload no Play Console e distribuir para testadores).
- Ou converta para APKs para testes locais (bundletool) — normalmente não necessário.

5. Checklist técnico no Play Console

- Selecione o target de release (internal/closed/production).
- Adicione release notes e screenshots.
- Configure a política de privacidade, conteúdo e classificações.
- Configure a distribuição (países, faixa etária, dispositivos compatíveis).

6. App Signing & Keystore

- Se já tiver um app publicado: confirme se a `app signing key` do Play é compatível.
- Se estiver migrando: siga as instruções de exportação/registro do Play para chaves.

7. Assinatura final

- Faça upload do AAB e confirme que o Play Console aceita o AAB assinado.
- Verifique warnings/erros no Play Console; corrija se necessário.

8. Pós-upload

- Monitore relatórios e crashlytics após disponibilizar para usuários.

Troubleshooting comum

- Erro: "keystore password was incorrect" -> revisar `android/keystore.properties` e `storeFile` path.
- Erro: "No matching variant" -> algum módulo nativo não publicou variantes esperadas (posso investigar e corrigir).
- Erro: "Inconsistent JVM-target" -> alinhar `kotlinOptions.jvmTarget` e `compileOptions`/toolchain.

Se quiser, eu posso:

- Gerar os artefatos de CI (YAML) para GitHub Actions que rodem `./gradlew bundleRelease` e publiquem o AAB.
- Ajudar a migrar para Java 21 e aplicar patches nos módulos nativos para remover workarounds locais.
