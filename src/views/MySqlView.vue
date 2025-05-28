<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-6 text-indigo-700">Conexión a MySQL</h1>

    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Agregar Dato</h2>
      <div class="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          v-model="nuevoDato.nombre"
          placeholder="Nombre"
          class="flex-1 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          v-model="nuevoDato.valor"
          placeholder="Valor"
          class="flex-1 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        @click="agregarDato"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
      >
        Agregar
      </button>
      <div v-if="message" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'" class="mt-4 text-center">
        {{ message }}
      </div>
    </div>

    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Datos de la Base de Datos</h2>
      <ul class="space-y-3 mb-6">
        <li
          v-for="dato in datos"
          :key="dato.id"
          class="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200"
        >
          <span class="text-gray-700 font-medium">{{ dato.nombre }}:</span>
          <span class="text-gray-600">{{ dato.valor }}</span>
        </li>
        <li v-if="datos.length === 0" class="text-center text-gray-500 italic">No hay datos para mostrar.</li>
      </ul>
      <button
        @click="obtenerDatos"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
      >
        Actualizar Datos
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Variables reactivas utilizando `ref`
const datos = ref([]); // Almacena los datos obtenidos de la base de datos
const nuevoDato = ref({
  nombre: '',
  valor: ''
}); // Almacena los valores para el nuevo dato a agregar
const message = ref(''); // Mensaje para el usuario (éxito/error)
const messageType = ref(''); // Tipo de mensaje (success/error)

// Función para mostrar un mensaje temporal al usuario
const showMessage = (msg, type = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
    messageType.value = '';
  }, 3000); // El mensaje desaparece después de 3 segundos
};

// Método asíncrono para obtener datos de la API
const obtenerDatos = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/datos');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    datos.value = await response.json(); // Asigna los datos al valor de la referencia reactiva
    showMessage('Datos actualizados correctamente.', 'success');
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    showMessage(`Error obteniendo datos: ${error.message}`, 'error');
  }
};

// Método asíncrono para agregar un nuevo dato a la API
const agregarDato = async () => {
  // Validación básica para asegurar que los campos no estén vacíos
  if (!nuevoDato.value.nombre.trim() || !nuevoDato.value.valor.trim()) {
    showMessage('Por favor, introduce un nombre y un valor.', 'error');
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/api/datos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoDato.value), // Envía el valor de la referencia reactiva
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resultado = await response.json();
    datos.value.push(resultado); // Agrega el nuevo dato a la lista reactiva
    nuevoDato.value = { nombre: '', valor: '' }; // Limpia los campos del formulario
    showMessage('Dato agregado correctamente.', 'success');
  } catch (error) {
    console.error('Error agregando dato:', error);
    showMessage(`Error agregando dato: ${error.message}`, 'error');
  }
};

// Hook de ciclo de vida `onMounted` (equivalente a `mounted` en Options API)
onMounted(() => {
  obtenerDatos(); // Llama a obtenerDatos cuando el componente se monta
});
</script>

<style scoped>
/* Puedes añadir estilos específicos para este componente aquí si no usas Tailwind CSS */
/* Aunque con Tailwind CSS, la mayoría de los estilos se aplican directamente en el template */
</style>
