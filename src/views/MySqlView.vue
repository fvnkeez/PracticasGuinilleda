<template>
  <div>
    <h1>Conexión a MySQL</h1>
    
    <div>
      <h2>Agregar dato</h2>
      <input v-model="nuevoDato.nombre" placeholder="Nombre">
      <input v-model="nuevoDato.valor" placeholder="Valor">
      <button @click="agregarDato">Agregar</button>
    </div>
    
    <div>
      <h2>Datos de la base de datos</h2>
      <ul>
        <li v-for="dato in datos" :key="dato.id">
          {{ dato.nombre }}: {{ dato.valor }}
        </li>
      </ul>
      <button @click="obtenerDatos">Actualizar datos</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datos: [],
      nuevoDato: {
        nombre: '',
        valor: ''
      }
    };
  },
  mounted() {
    this.obtenerDatos();
  },
  methods: {
    async obtenerDatos() {
      try {
        const response = await fetch('http://localhost:3001/api/datos');
        this.datos = await response.json();
      } catch (error) {
        console.error('Error obteniendo datos:', error);
      }
    },
    async agregarDato() {
      try {
        const response = await fetch('http://localhost:3001/api/datos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.nuevoDato),
        });
        
        const resultado = await response.json();
        this.datos.push(resultado);
        this.nuevoDato = { nombre: '', valor: '' };
      } catch (error) {
        console.error('Error agregando dato:', error);
      }
    }
  }
};
</script>