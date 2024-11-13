<template>
  <q-page class="bg-dark" padding>
    <div class="q-pt-xl q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-10">
          <div class="text-h4 text-weight-bold text-white">
            Estoque sala da T.I
          </div>
        </div>

        <div class="col-2">
          <q-btn label="Adicionar" color="accent" @click="abrirDialogo" />
        </div>

        <div class="col-12">
          <q-input
            v-model="search"
            dense
            outlined
            dark
            placeholder="Pesquisar produto"
            class="q-mb-md"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12">
          <q-table
            :rows="filteredInformacoes"
            :columns="colunas"
            row-key="id"
            dark
          >
            <template #body-cell-edit="props">
              <q-td :props="props">
                <q-btn-group>
                  <q-btn
                    icon="edit"
                    flat
                    dense
                    @click="editarInformacao(props.row)"
                  />
                  <q-btn
                    icon="delete"
                    flat
                    dense
                    @click="excluirInformacao(props.row)"
                  />
                </q-btn-group>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="formData.data"
                dense
                outlined
                type="date"
                label="Data"
              />
            </div>

            <div class="col-7">
              <q-input
                v-model="formData.produto"
                dense
                outlined
                type="text"
                label="Produto"
              />
            </div>

            <div class="col-5">
              <q-input
                v-model="formData.quantidade"
                dense
                outlined
                type="number"
                label="Quantidade"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="accent" v-close-popup />
          <q-btn
            flat
            label="Salvar"
            color="accent"
            @click="salvarInformacoes"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-footer elevated class="bg-dark">
      <q-tabs v-model="tab" class="text-primary">
        <q-tab
          name="home"
          icon="home"
          label="Início"
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
          name="pr"
          icon="description"
          label="PR"
          @click="changePage('pr')"
        />
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import { data } from "autoprefixer";
import { computed } from "vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const dialog = ref(false);
    const dialogView = ref(false);
    const tab = ref("home");
    const router = useRouter();
    const idEditando = ref(null);
    const formDataView = ref({});
    const search = ref("");
    const formData = ref({
      id: null,
      data: "",
      produto: "",
      quantidade: "",
    });
    const informacoes = ref([]);
    const filteredInformacoes = computed(() => {
      if (search.value) {
        return informacoes.value.filter((informacao) =>
          informacao.produto.toLowerCase().includes(search.value.toLowerCase())
        );
      }
      return informacoes.value;
    });
    const colunas = ref([
      { name: "data", label: "Data", field: "data" },
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
      };
      router.push(routes[pageName]);
    };

    return {
      tab,
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
