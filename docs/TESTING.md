# Testes automatizados

## Stack

- Mocha: organização e execução dos cenários.
- Chai: asserções dos resultados HTTP e dos dados retornados.
- SuperTest: chamadas HTTP à API sem necessidade de subir um servidor separado.
- MongoDB: serviço iniciado pelo GitHub Actions para os testes de integração.

## Organização e padrões

- Os cenários ficam em `test/`.
- Dados reutilizáveis ficam em `test/data/testData.json`, separados da lógica dos testes.
- Autenticação é centralizada em `test/helpers/auth.js`, evitando duplicação de chamadas de login.
- Os testes validam status HTTP, presença de propriedades e valores relevantes das respostas.
- O fluxo de integração cobre cadastro de aluno pelo administrador, matrícula em disciplina, login do aluno e envio de trabalho, com limpeza dos registros criados.

Como este projeto testa uma **API REST**, não há elementos de interface web nem seletores DOM (CSS/XPath). O equivalente neste contexto é selecionar e validar os recursos por seus endpoints HTTP, métodos e parâmetros de rota.

## Execução local

Pré-requisitos: Node.js 20+ e MongoDB acessível.

```bash
npm ci
MONGODB_URI=mongodb://127.0.0.1:27017/gestao-de-alunos-test npm test
```

Para gerar um relatório JSON local:

```bash
mkdir -p reports
MONGODB_URI=mongodb://127.0.0.1:27017/gestao-de-alunos-test npm test -- --reporter json > reports/test-results.json
```

O arquivo `reports/test-results.json` contém o resultado estruturado da execução.

## GitHub Actions e relatórios

O workflow `.github/workflows/tests.yml` executa automaticamente em `push` e `pull_request` direcionados à branch `main`. Ele configura Node.js 20, inicia MongoDB 7, instala as dependências com `npm ci` e executa os testes.

Ao final de cada execução, o workflow tenta publicar o artefato `api-test-report` com o relatório JSON, inclusive quando os testes falham (desde que o arquivo tenha sido criado). Para baixar: abra **Actions**, selecione a execução e baixe o artefato na seção **Artifacts**. A retenção configurada é de 14 dias.
