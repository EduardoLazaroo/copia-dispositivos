# Passo a Passo — Aula 19: Projeto Integrador - Parte 3 (Build de Produção e Homologação)

**Disciplina:** Desenvolvimento de Aplicativos Móveis  
**Tema:** Projeto Integrador - Parte 3 (Build de Produção e Homologação)  
---

> [!NOTE]
> **Objetivo Operacional:** Realizar o build de produção otimizado da aplicação frontend Ionic/Angular (`ionic build --prod`), sincronizar os artefatos nativos via Capacitor CLI (`npx cap sync`), auditar a estabilidade dos serviços no backend e aplicar o checklist de homologação final.

> [!TIP]
> 💡 **Analogia Didática da Aula:** Fazer o Build de Produção (`ionic build --prod`) é como empacotar uma mercadoria em uma caixa lacrada: o compilador do Angular pega todo o código TypeScript, limpa comentários e instruções de debug e gera arquivos JavaScript compactados e otimizados para máxima velocidade.  
> 📌 **Dica Prática:** A pasta `www` (ou `dist`) gerada pelo comando `ionic build --prod` contém os arquivos estáticos finais prontos para serem distribuídos.

## 📁 Padrão de Caminhos e Organização
- Pasta base da turma: `projetos`
- Projeto Mobile: `projetos/ionic_projeto`
- Projeto API: `projetos/mobile_api`

> [!IMPORTANT]
> - Manter os 3 terminais ativos durante a prática:
>   - **Terminal A:** Mobile (`cd projetos/ionic_projeto` -> `npm run start`)
>   - **Terminal B:** API (`cd projetos/mobile_api` -> `npm start`)
>   - **Terminal C:** CLI do Ionic/Capacitor para compilação
> - Executar a verificação de erros de compilação antes de gerar o pacote de distribuição final.

---

## ⏱️ Roteiro Completo de Atividades (4 Horas)

### Bloco 1 - Auditoria de Código e Checagem de Tipos no Projeto Mobile

1. No **Terminal C (Git Bash)**, acessar a pasta do projeto mobile:
```bash
cd projetos/ionic_projeto
```

2. **Executar a checagem de compilação sem gerar arquivos estáticos:**
```bash
npx ng build --dry-run
```

3. Verificar se existem avisos de sintaxe ou variáveis sem tipagem no terminal.
4. Remover imports não utilizados e comandos `console.log()` desnecessários.

---

### Bloco 2 - Build de Produção do Ionic Frontend

1. No **Terminal C (Git Bash)**, executar a compilação otimizada de produção:
```bash
ionic build --prod
```
> 💡 **O que faz o `ionic build --prod`?**  
> Ele compila o projeto Angular utilizando otimizações do AOT (*Ahead-Of-Time*), minifica o código HTML/CSS/JS e gera os artefatos estáticos na pasta `www/`.

2. **Confirmar a geração da pasta `www/`:**
   - Verifique a criação da pasta `projetos/ionic_projeto/www/`.

3. **Sincronizar a pasta compilada com as plataformas nativas do Capacitor:**
```bash
npx cap sync
```

---

### Bloco 3 - Preparação e Auditoria da API Node/Express

1. No **Terminal B (API)**, acessar a pasta do backend:
```bash
cd projetos/mobile_api
```

2. **Editar o arquivo `src/server.js` garantindo suporte à porta de ambiente e log visual de execução:**

```javascript
const app = require('./app');

// Lê a porta configurada no ambiente ou assume a porta 3000 como padrão
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`API PROJETO INTEGRADOR OPERACIONAL`);
  console.log(`URL Base: http://localhost:${PORT}`);
  console.log(`=================================`);
});
```

3. Reiniciar a API no Terminal B:
```bash
npm start
```

4. **Executar bateria de testes nos endpoints via terminal:**
   - **No Git Bash:**
     ```bash
     curl http://localhost:3000/health
     curl http://localhost:3000/chamados
     ```
   - **No PowerShell:**
     ```powershell
     Invoke-RestMethod http://localhost:3000/health
     Invoke-RestMethod http://localhost:3000/chamados
     ```

---

### Bloco 4 - Checklist de Homologação e Testes de Responsividade

1. Garantir que o projeto mobile compilado está em execução no **Terminal A**:
```bash
npm run start
```

2. **Aplicar o Checklist de Homologação Funcional da Aplicação:**
   - [x] Autenticação de Login com JWT e armazenamento local do token.
   - [x] Navegação por Abas (`ion-tabs`) e Menu Lateral (`ion-menu`).
   - [x] Consumo de endpoints `GET`, `POST`, `PUT` e `DELETE` da API Express.
   - [x] Resiliência de cache offline e preferências (`@capacitor/preferences`).
   - [x] Integração com recursos nativos do dispositivo (Câmera / GPS / Rede).

3. Testar a interface em emulação de dispositivos móveis no DevTools (`Ctrl + Shift + M`).

---

## 🔄 Fluxo Resumido de Execução Diária

1. **Terminal A (Mobile):**
```bash
cd projetos/ionic_projeto
ionic build --prod
npm run start
```

2. **Terminal B (API):**
```bash
cd projetos/mobile_api
npm start
```

3. **Validação:**
   - Confirmar a geração limpa do build de produção e aprovação do checklist.

---

## ✅ Saída Esperada ao Final da Aula

- Build de produção gerado na pasta `www/` via `ionic build --prod`.
- Projeto nativo sincronizado com o pacote web atualizado via `npx cap sync`.
- API backend Node/Express pronta para execução continuada.
- Checklist de homologação 100% aprovado para a apresentação final.

---

**De onde viemos:**  
Retomamos os aprendizados de 'Projeto Integrador - Parte 2', consolidando os fundamentos necessários para avançar com segurança.

**Para onde vamos:**  
A partir desta base, avançaremos para 'Publicação e Manutenção', ampliando complexidade, autonomia e capacidade de aplicação prática.
