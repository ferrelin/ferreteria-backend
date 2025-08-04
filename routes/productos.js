const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dh3pmwa11',
  api_key: '419445588789197',
  api_secret: 'XGGV55N4rjLiCkQR2bQLOtNwuks'
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ferreteria',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage });

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar productos por nombre o código
router.get('/buscar', async (req, res) => {
  const q = req.query.q || '';
  try {
    const productos = await Producto.find({
      $or: [
        { nombre: new RegExp(q, 'i') },
        { codigo: new RegExp(q, 'i') }
      ]
    });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    res.json(producto);
  } catch (err) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Crear producto
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const nuevoProducto = new Producto({
      nombre: req.body.nombre,
      precio: req.body.precio,
      precioCompra: req.body.precioCompra, // Agregado
      stock: req.body.stock,
      codigo: req.body.codigo,
      imagen: req.file ? req.file.path : ''
    });

    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Editar producto
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const datosActualizados = {
      nombre: req.body.nombre,
      precio: req.body.precio,
      precioCompra: req.body.precioCompra, // Agregado
      stock: req.body.stock,
      codigo: req.body.codigo
    };

    if (req.file) {
      datosActualizados.imagen = req.file.path;
    }

    const producto = await Producto.findByIdAndUpdate(req.params.id, datosActualizados, { new: true });
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
