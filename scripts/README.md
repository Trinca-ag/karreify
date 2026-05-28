# Scripts

## storage-lifecycle.json

Regras de ciclo de vida do bucket do Firebase Storage que garantem limpeza
automática de PDFs órfãos. Aplica-se diretamente ao bucket do projeto via
`gcloud` (Firebase Storage usa GCS por baixo).

### Regras configuradas

| Prefixo       | Idade | Ação    | Por quê |
|---------------|-------|---------|---------|
| `users/`      | 1 dia | Excluir | PDFs salvos têm TTL lógico de 10 h no Firestore. 1 dia dá margem para diferenças de relógio e cobre arquivos cujo doc Firestore expirou mas o blob não foi apagado. |
| `tickets/`    | 30 dias | Excluir | Imagens de chamados — depois de 30 dias o ticket já fechou e o anexo perdeu utilidade. |

### Como aplicar (uma vez por ambiente)

Requer `gcloud` autenticado com permissão `Storage Admin` no projeto Firebase.

```bash
# 1. Descobrir o nome do bucket (geralmente <projeto>.appspot.com ou .firebasestorage.app)
gcloud storage buckets list --filter="name:karreify" --format="value(name)"

# 2. Aplicar as regras (substitua BUCKET pelo nome retornado acima)
gcloud storage buckets update gs://BUCKET --lifecycle-file=scripts/storage-lifecycle.json

# 3. Conferir
gcloud storage buckets describe gs://BUCKET --format="value(lifecycle)"
```

### Para reverter

```bash
# Limpa todas as regras de lifecycle
gcloud storage buckets update gs://BUCKET --clear-lifecycle
```

### Observações

- **Regras lifecycle rodam uma vez por dia**, então a remoção pode levar
  algumas horas após a idade atingida — é assíncrono. Não é problema porque o
  Firestore doc já está expirado e o app não tenta ler o blob.
- **Custo**: zero. Operações de DELETE feitas pelo lifecycle são gratuitas
  segundo o pricing do GCS.
- **Não conflita** com o `deleteStorageSafe` chamado no código quando o usuário
  apaga manualmente — apenas serve de rede de segurança para órfãos.
