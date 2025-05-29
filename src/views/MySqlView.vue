<script setup>
import { ref, onMounted } from 'vue';

const datos = ref([]);
const nuevoDato = ref({ nombre: '', valor: '' });
const snackbarVisible = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');
const datoEditando = ref(null);

const showMessage = (msg, type = 'success') => {
  snackbarMessage.value = msg;
  snackbarColor.value = type === 'success' ? 'green' : 'red';
  snackbarVisible.value = true;
};

const obtenerDatos = async () => {
  try {
    const response = await fetch('http://192.168.1.166:3006/api/datos');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    datos.value = await response.json();
    showMessage('Datos actualizados correctamente.', 'success');
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    showMessage(`Error obteniendo datos: ${error.message}`, 'error');
  }
};

const agregarDato = async () => {
  if (!nuevoDato.value.nombre.trim() || !nuevoDato.value.valor.trim()) {
    showMessage('Por favor, introduce un nombre y un valor.', 'error');
    return;
  }

  try {
    const response = await fetch('http://192.168.1.166:3006/api/datos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoDato.value),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const resultado = await response.json();
    datos.value.push(resultado);
    nuevoDato.value = { nombre: '', valor: '' };
    showMessage('Dato agregado correctamente.', 'success');
  } catch (error) {
    console.error('Error agregando dato:', error);
    showMessage(`Error agregando dato: ${error.message}`, 'error');
  }
};

const borrarDato = async (dato) => {
  const confirmado = confirm(`¿Estás seguro de que deseas eliminar "${dato.nombre}"?`);
  if (!confirmado) return;

  try {
    const response = await fetch(`http://192.168.1.166:3006/api/datos/${dato.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    datos.value = datos.value.filter(d => d.id !== dato.id);
    showMessage('Dato eliminado correctamente.', 'success');
  } catch (error) {
    console.error('Error al eliminar el dato:', error);
    showMessage(`No se pudo eliminar el dato: ${error.message}`, 'error');
  }
};

const guardarEdicion = async () => {
  if (!datoEditando.value) return;

  try {
    const response = await fetch(`http://192.168.1.166:3006/api/datos/${datoEditando.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datoEditando.value),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const actualizado = await response.json();
    const index = datos.value.findIndex(d => d.id === actualizado.id);
    if (index !== -1) datos.value[index] = actualizado;

    datoEditando.value = null;
    showMessage('Dato actualizado correctamente.', 'success');
  } catch (error) {
    console.error('Error actualizando dato:', error);
    showMessage(`Error actualizando dato: ${error.message}`, 'error');
  }
};

onMounted(() => {
  obtenerDatos();
});
</script>

<template>
  <v-app>
    <v-app-bar color="grey-darken-3" :elevation="3" rounded>
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>MANADATA</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-heart"></v-btn>
        <v-btn icon="mdi-magnify"></v-btn>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center bg-grey-darken-4" width="1200">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="mb-8" elevation="6" rounded="lg">
              <v-card-title class="text-h5">Agregar Dato</v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="nuevoDato.nombre" label="Nombre" variant="outlined" clearable hide-details />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="nuevoDato.valor" label="Valor" variant="outlined" clearable hide-details />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="purple" variant="elevated" size="large" @click="agregarDato" block class="text-white">
                  Agregar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card elevation="6" rounded="lg">
              <v-card-title class="text-h5">Datos de la Base de Datos</v-card-title>
              <v-card-text>
                <v-list v-if="datos.length > 0" lines="one">
                  <v-list-item v-for="dato in datos" :key="dato.id" class="mb-2" rounded="md" elevation="1">
                    <template v-slot:prepend>
                      <v-btn icon @click="borrarDato(dato)" class="ma-2">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>

                    <div class="w-full">
                      <div v-if="datoEditando && datoEditando.id === dato.id">
                        <v-text-field v-model="datoEditando.nombre" label="Nombre" variant="outlined" dense class="mb-2" />
                        <v-text-field v-model="datoEditando.valor" label="Valor" variant="outlined" dense />
                        <v-btn color="success" size="small" class="mt-2 me-2" @click="guardarEdicion">Guardar</v-btn>
                        <v-btn color="grey" size="small" class="mt-2" @click="datoEditando = null">Cancelar</v-btn>
                      </div>
                      <div v-else class="d-flex justify-space-between align-center">
                        <div>
                          <div class="text-subtitle-1 font-weight-medium">{{ dato.nombre }}</div>
                          <div class="text-body-2 text-grey">{{ dato.valor }}</div>
                        </div>
                        <v-btn icon @click="datoEditando = { ...dato }" class="ma-2">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-list-item>
                </v-list>

                <v-alert v-else type="info" variant="tonal" class="text-center" icon="mdi-information-outline">
                  No hay datos para mostrar.
                </v-alert>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="success" variant="elevated" size="large" @click="obtenerDatos" block class="text-white">
                  Actualizar Datos
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-snackbar v-model="snackbarVisible" :color="snackbarColor" :timeout="3000" location="bottom right">
          {{ snackbarMessage }}
          <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbarVisible = false">
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>