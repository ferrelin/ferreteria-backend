const mongoose = require('mongoose');

const esquemaProducto = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: [0.1, 'El precio mínimo debe ser 0.10'] },
  precioCompra:  { type: Number, required: true, min: [0.1, 'El precio mínimo debe ser 0.10'] },
  codigo: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, min: [0, 'El stock no puede ser negativo'] },
  descripcion: { type: String, trim: true },
  imagen: { type: String },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Producto', esquemaProducto);
