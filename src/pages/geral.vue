<template>
  <q-page class="bg-dark" padding>
    <div class="q-pt-xl q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-10">
          <div class="text-h4 text-weight-bold text-align: justify text-white">
            Estoque Geral
          </div>
        </div>
        <div class="col-2">
          <q-btn label="adicionar" color="accent" @click="abrirDialogo" />
        </div>
        <div class="col-12">
          <q-input
            v-model="search"
            dense
            outlined
            dark
            placeholder="Pesquisar produto ou categoria"
            class="q-mb-md"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12">
          <q-table
            :rows="filteredInformacoes"
            :columns="colunas"
            row-key="Estoque"
            dark
          >
            <template v-slot:body-cell-edit="props">
              <q-td :props="props">
                <q-btn icon="edit" @click="editarInformacao(props.row)" />
                <q-btn icon="delete" @click="excluirInformacao(props.row)" />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="col-12">
            <div class="row">
              <div class="col-6 q-mr-lg">
                <label class="text-h6">Data</label>
                <q-input
                  dense
                  class="text-h6"
                  hide-bottom-space
                  bg-color="white"
                  outlined
                  rounded
                  emit-value
                  map-options
                  type="Date"
                  v-model="formData.data"
                  label="Data"
                />
              </div>
              <div class="col-5">
                <label class="text-h6">Categoria</label>
                <q-input
                  dense
                  class="text-h6"
                  hide-bottom-space
                  bg-color="white"
                  outlined
                  rounded
                  emit-value
                  map-options
                  type="text"
                  v-model="formData.categoria"
                  label="Categoria"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-6 q-mr-lg">
                <label class="text-h6">Produto</label>
                <q-input
                  dense
                  class="text-h6"
                  hide-bottom-space
                  bg-color="white"
                  outlined
                  rounded
                  emit-value
                  map-options
                  type="text"
                  v-model="formData.produto"
                  label="Produto"
                />
              </div>
              <div class="col-5">
                <label class="text-h6">Quantidade</label>
                <q-input
                  dense
                  class="text-h6"
                  hide-bottom-space
                  bg-color="white"
                  outlined
                  rounded
                  emit-value
                  map-options
                  type="number"
                  v-model="formData.quantidade"
                  label="Quantidade"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="accent" v-close-popup />
          <q-btn
            flat
            label="salvar"
            color="accent"
            @click="salvarInformacoes"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-footer elevated class="bg-dark text-white">
      <q-tabs v-model="tab" class="text-primary">
        <q-tab
          name="home"
          icon="home"
          label="Inicio"
          @click="changePage('home')"
        />
        <q-tab
          name="ti"
          icon="computer"
          label="T.I"
          @click="changePage('ti')"
        />
        <q-tab
          name="geral"
          icon="inventory"
          label="Geral"
          @click="changePage('geral')"
        />
        <q-tab
          name="relatorio"
          icon="description"
          label="Relatório"
          @click="changePage('relatorio')"
        />
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import { useRouter } from "vue-router";
import { computed } from "vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const dialog = ref(false);
    const dialogView = ref(false);
    const router = useRouter();
    const idEditando = ref(null);
    const formDataView = ref({});
    const search = ref("");
    const formData = ref({
      id: null,
      data: "",
      produto: "",
      quantidade: "",
      categoria: "",
    });
    const informacoes = ref([]);
    const filteredInformacoes = computed(() => {
      const searchTerm = search.value?.toLowerCase();
      if (!searchTerm) return informacoes.value;

      return informacoes.value.filter(
        (informacao) =>
          informacao.produto.toLowerCase().includes(searchTerm) ||
          informacao.categoria.toLowerCase().includes(searchTerm)
      );
    });
    const colunas = ref([
      { name: "data", label: "Data", field: "data" },
      { name: "categoria", label: "Categoria", field: "categoria" },
      { name: "produto", label: "Produto", field: "produto" },
      { name: "quantidade", label: "Quantidade", field: "quantidade" },

      {
        name: "edit",
        label: "",
        field: "id",
        align: "center",
        sortable: false,
      },
    ]);
    function abrirPopupEdicao(row) {
      formData.value = { ...row };
      idEditando.value = row.id; // Armazena o ID da linha que está sendo editada
      dialog.value = true;
    }
    function abrirDialogo() {
      dialog.value = true;
    }
    function salvarInformacoes() {
      if (idEditando.value !== null) {
        // Encontra o índice da informação a ser atualizada
        const index = informacoes.value.findIndex(
          (info) => info.id === idEditando.value
        );
        if (index !== -1) {
          informacoes.value[index] = { ...formData.value };
        }
      } else {
        // Se não estiver editando (ou seja, adicionando uma nova informação), adiciona ao array
        informacoes.value.push({ ...formData.value, id: Date.now() }); // Garante um ID único para novas entradas
      }
      // Reseta o estado do diálogo e do formulário
      dialog.value = false;
      formData.value = {};
      idEditando.value = null; // Reseta o ID sendo editado
    }
    function editarInformacao(row) {
      this.abrirPopupEdicao(row);
    }
    function habilitarEdicao() {
      dialog.value = true;
      dialogView.value = false;
      formData.value = { ...formDataView.value };
    }
    function excluirInformacao(row) {
      const index = informacoes.value.findIndex((item) => item.id === row.id);
      if (index !== -1) {
        informacoes.value.splice(index, 1);
      }
    }
    const changePage = (pageName) => {
      const routes = {
        home: "/inicio",
        ti: "/TIestoque",
        geral: "/geral",
        pr: "/movies",
      };
      router.push(routes[pageName]);
    };

    return {
      tab: ref("home"),
      changePage,
      search,
      filteredInformacoes,
      dialog,
      formData,
      formDataView,
      dialogView,
      informacoes,
      colunas,
      salvarInformacoes,
      habilitarEdicao,
      editarInformacao,
      abrirPopupEdicao,
      abrirDialogo,
      excluirInformacao,
    };
  },
});
</script>
<!-- <script setup>
defineOptions({
  name: "IndexPage",
});
</script> -->
