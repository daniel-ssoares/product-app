# Mesa & Máquina

Catálogo de itens de computação, periféricos e escritório, com cadastro, edição, exclusão, busca por nome/descrição e filtro por categoria.

O painel mostra modelos cadastrados, unidades disponíveis, valor do estoque (preço × quantidade) e itens com até cinco unidades. Os indicadores consideram o catálogo inteiro, independentemente dos filtros.

## Funcionalidades

- Catálogo inicial com notebook, monitor, teclado, mouse, cadeira, organizador, hub USB-C e luminária.
- Busca por nome ou descrição, sem distinção de acentos, e filtro por categoria.
- Cadastro e edição em formulário único, com validações e mensagens de erro da API.
- Exclusão com confirmação e indicação de operação em andamento.
- Destaques para estoque baixo (1 a 5 unidades) e itens sem estoque.
- Interface responsiva em português, com preços em reais.

## Estrutura

```text
ProductApp/ProductApi/
  Contracts/       Entradas validadas e respostas da API
  Controllers/     Endpoints HTTP
  Data/            Contexto e catálogo inicial
  Models/          Entidade de produto
  Repositories/    Acesso aos dados
product-frontend/
  src/app/         Telas, modelos e serviços Angular
  proxy.conf.json  Encaminhamento da API no desenvolvimento
scripts/
  test-api.mjs     Teste de integração HTTP
```

## Tecnologias

- API: .NET 8, ASP.NET Core, Entity Framework Core InMemory e Swagger.
- Interface: Angular 20.3, TypeScript e formulários reativos tipados.

## Executar localmente

Pré-requisitos: SDK .NET 8 ou superior com runtime .NET 8, Node.js 22.12+ (ou 24) e npm.

Na raiz:
```sh
dotnet run --project ProductApp/ProductApi --launch-profile http
```
API: http://localhost:5127/api/products · Swagger: http://localhost:5127/swagger

Em outro terminal:
```sh
cd product-frontend
npm ci
npm start
```
Interface: http://localhost:4200

O frontend usa a rota relativa /api/products. No desenvolvimento, proxy.conf.json encaminha /api para http://localhost:5127. Reinicie o servidor Angular depois de alterar o proxy. Em produção, configure o servidor web para encaminhar /api à API e servir index.html para as rotas da interface. O token PRODUCT_API_URL permite substituir a URL por injeção de dependência.

## Contrato da API

| Método | Rota | Operação |
| --- | --- | --- |
| GET | `/api/products` | Listar itens |
| GET | `/api/products/{id}` | Consultar item |
| POST | `/api/products` | Cadastrar item |
| PUT | `/api/products/{id}` | Atualizar item |
| DELETE | `/api/products/{id}` | Excluir item |

Cadastro e atualização recebem:
```json
{
  "name": "Monitor IPS 27",
  "description": "Tela QHD com ajuste de altura.",
  "category": "Computação",
  "price": 1590,
  "stock": 12
}
```
Categorias: Computação, Periféricos, Escritório. Nome: até 200 caracteres; descrição: até 500; preço: de 0,01 a 999999999,99; estoque: inteiro de 0 a 2147483647. Todos são obrigatórios. ID e data de criação são controlados pelo servidor. A resposta inclui id e createdAt (texto ISO 8601 em UTC). Erros usam ProblemDetails/ValidationProblemDetails.

## Limites

O banco permanece em memória: os dados são reiniciados com oito itens de exemplo quando a API reinicia. Não há autenticação nem histórico de movimentações. A quantidade em estoque é editada diretamente.

## Verificação

```sh
dotnet build ProductApp/ProductApi/ProductApi.csproj
cd product-frontend
npm run build
```
Com a API em execução, rode `node scripts/test-api.mjs` na raiz para verificar CRUD, validações e campos controlados pelo servidor. O teste cria e remove apenas seu próprio item. A variável `API_URL` permite apontar para outro ambiente de teste.
