<script setup>
import { ref, onMounted } from 'vue';

// Reactive variables using `ref`
const datos = ref([]); // Stores data fetched from the database
const nuevoDato = ref({
  nombre: '',
  valor: ''
}); // Stores values for the new data to be added
const snackbarVisible = ref(false); // Controls the visibility of the snackbar
const snackbarMessage = ref(''); // Message for the user (success/error)
const snackbarColor = ref(''); // Type of message (success/error)

// Function to show a temporary message to the user using v-snackbar
const showMessage = (msg, type = 'success') => {
  snackbarMessage.value = msg;
  snackbarColor.value = type === 'success' ? 'green' : 'red';
  snackbarVisible.value = true;
};

// Asynchronous method to fetch data from the API
const obtenerDatos = async () => {
  try {
    const response = await fetch('http://192.168.1.166:3006/api/datos');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    datos.value = await response.json(); // Assigns data to the reactive reference value
    showMessage('Datos actualizados correctamente.', 'success');
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    showMessage(`Error obteniendo datos: ${error.message}`, 'error');
  }
};

// Asynchronous method to add new data to the API
const agregarDato = async () => {
  // Basic validation to ensure fields are not empty
  if (!nuevoDato.value.nombre.trim() || !nuevoDato.value.valor.trim()) {
    showMessage('Por favor, introduce un nombre y un valor.', 'error');
    return;
  }

  try {
    const response = await fetch('http://192.168.1.166:3006/api/datos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoDato.value), // Sends the reactive reference value
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resultado = await response.json();
    datos.value.push(resultado); // Adds the new data to the reactive list
    nuevoDato.value = { nombre: '', valor: '' }; // Clears form fields
    showMessage('Dato agregado correctamente.', 'success');
  } catch (error) {
    console.error('Error agregando dato:', error);
    showMessage(`Error agregando dato: ${error.message}`, 'error');
  }
};

// Acción de eliminado (Corrected for Composition API)
const borrarDato = async (dato) => {
  const confirmado = confirm(`¿Estás seguro de que deseas eliminar "${dato.nombre}"?`);
  if (!confirmado) return;
  console.log('Attempting to delete dato with ID:', dato.id); // Add this line
    console.log('Constructed URL:', `http://192.168.1.166:3006/api/datos/${dato.id}`); // Add this line
  try {
    // Corrected: Include the dato.id in the URL for the DELETE request
    const response = await fetch(`http://192.168.1.166:3006/api/datos/${dato.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Filter out the deleted item from the reactive list
    datos.value = datos.value.filter(d => d.id !== dato.id);
    showMessage('Dato eliminado correctamente.', 'success'); // Using the defined showMessage
  } catch (error) {
    console.error('Error al eliminar el dato:', error);
    showMessage(`No se pudo eliminar el dato: ${error.message}`, 'error'); // Using the defined showMessage
  }
};

// `onMounted` lifecycle hook (equivalent to `mounted` in Options API)
onMounted(() => {
  obtenerDatos(); // Calls obtenerDatos when the component is mounted
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
      <v-container class="">
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="mb-8" elevation="6" rounded="lg">
              <v-card-title class="text-h5">Agregar Dato</v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="nuevoDato.nombre" label="Nombre" variant="outlined" clearable
                      hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="nuevoDato.valor" label="Valor" variant="outlined" clearable
                      hide-details></v-text-field>
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
                  <v-list-item v-for="dato in datos" :key="dato.id" class="mb-2" :title="dato.nombre"
                    :subtitle="dato.valor" rounded="md" elevation="1">
                    <template v-slot:prepend>
                      <v-btn icon @click="borrarDato(dato)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
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
