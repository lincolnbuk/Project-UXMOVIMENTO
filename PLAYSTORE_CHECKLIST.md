# Play Store Checklist — UxMovimento

Use esta checklist antes de subir o AAB ao Play Console.

1. Versão e assinatura

   - [ ] Atualizar `versionCode` e `versionName` em `android/app/build.gradle` (em `defaultConfig`).
   - [ ] Verificar que o AAB está assinado com o keystore correto (`android/release-key.keystore`) e que `android/keystore.properties` aponta para o keystore e contém as senhas corretas. (As credenciais foram criadas localmente no repositório.)

2. Gerar AAB assinado

   - [ ] Rodar `cd android && .\gradlew.bat clean bundleRelease` e confirmar que `android/app/build/outputs/bundle/release/app-release.aab` existe.

3. Testes em dispositivo

   - [ ] Testar versão release em um ou dois dispositivos reais (usar `bundletool` para gerar installable apks a partir do aab ou gerar `assembleRelease` APKs). Verificar permissões, fluxos de login e notificações.

4. Lint e crash reports

   - [ ] Verificar logs e corrigir warnings críticos do Android Lint.
   - [ ] Rodar smoke tests manuais nas telas-chave (login, perfil, chat, mapas/rota se houver).

5. Conteúdo do Play Console

   - [ ] Preparar ícones, screenshots (telefone/tablet), descrição curta e longa.
   - [ ] Preencher política de privacidade (se aplicável) e marcar permissões sensíveis.
   - [ ] Ativar assinatura em app signing by Google Play (se desejar) — subir chave de upload (upload key) separada se usar App Signing by Google Play.

6. Distribuição

   - [ ] Criar release no Play Console e carregar o AAB.
   - [ ] Preencher notas de versão (changelog) e configurar track (internal/test/production).

7. Pós-upload
   - [ ] Executar testes internal/test track antes de promover para produção.
   - [ ] Monitorar relatórios de crash e ANRs e corrigir problemas críticos antes do rollout total.

Observações técnicas

- O projeto atualmente usa um fallback temporário para Java 17 no `android/app/build.gradle` para garantir compatibilidade com módulos nativos. Se preferir migrar para Java 21 agora, informe que eu faço a migração completa e valido o build novamente.
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
