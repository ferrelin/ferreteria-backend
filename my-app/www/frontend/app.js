document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');
  const productIdInput = document.getElementById('productId');
  const nameInput = document.getElementById('name');
  const priceInput = document.getElementById('price');
  const compraInput = document.getElementById('precioCompra');
  const stockInput = document.getElementById('stock');
  const codigoInput = document.getElementById('category');
  const imageInput = document.getElementById('image');
  const productList = document.getElementById('productList');
  const searchInput = document.getElementById('searchInput');
  const toggleFormBtn = document.getElementById('toggleFormBtn');
  const formCard = document.querySelector('.card');

  const API_URL = 'https://ferreteria-backend-mjmz.onrender.com/api/productos';

  async function obtenerProductos() {
    try {
      const res = await fetch(API_URL);
      const productos = await res.json();
      mostrarProductos(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }

  function mostrarProductos(productos) {
    productList.innerHTML = '';
    productos.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('producto');
      card.innerHTML = `
        <h3>${p.nombre}</h3>
        ${p.imagen ? `<img src="${p.imagen}" alt="Imagen" style="max-width:200px;">` : ''}
        <p><strong>Precio:</strong> <b>S/. ${p.precio}</b></p>
        <p><strong>Precio de compra:</strong> <b>S/. ${p.precioCompra}</b></p>
        <p><strong>Stock:</strong> ${p.stock}</p>
        <p><strong>Código:</strong> ${p.codigo}</p>
        <button onclick="editarProducto('${p._id}')">Editar</button>
        <button onclick="eliminarProducto('${p._id}')">Eliminar</button>
      `;
      productList.appendChild(card);
    });
  }

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value;
    try {
      const res = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(query)}`);
      const productos = await res.json();
      mostrarProductos(productos);
    } catch (err) {
      console.error('Error al buscar productos:', err);
    }
  });

  toggleFormBtn.addEventListener('click', () => {
    formCard.classList.toggle('active');
    toggleFormBtn.textContent = formCard.classList.contains('active') ? '✖ Cerrar' : '+ Agregar Producto';
    if (!formCard.classList.contains('active')) {
      form.reset();
      productIdInput.value = '';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nameInput.value);
    formData.append('precio', priceInput.value);
    formData.append('precioCompra', compraInput.value);
    formData.append('stock', stockInput.value);
    formData.append('codigo', codigoInput.value);

    if (imageInput.files[0]) {
      formData.append('imagen', imageInput.files[0]);
    }

    const id = productIdInput.value;
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error en la operación');

      obtenerProductos();
      form.reset();
      productIdInput.value = '';
      formCard.classList.remove('active');
      toggleFormBtn.textContent = '+ Agregar Producto';
    } catch (error) {
      console.error('❌ Error al guardar producto:', error);
      alert('Error al guardar producto: ' + error.message);
    }
  });

  window.editarProducto = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const p = await res.json();

      productIdInput.value = p._id;
      nameInput.value = p.nombre;
      priceInput.value = p.precio;
      compraInput.value = p.precioCompra;
      stockInput.value = p.stock;
      codigoInput.value = p.codigo;

      formCard.classList.add('active');
      toggleFormBtn.textContent = '✖ Cerrar';
    } catch (error) {
      console.error('Error al cargar producto para editar:', error);
    }
  };

  window.eliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      obtenerProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  obtenerProductos();
});
