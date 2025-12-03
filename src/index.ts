import express, { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();

// config express
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

// in memory database
let products = [
  { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000 },
  { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000 },
  { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000 }
];

// home
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Selamat datang di e-commerce',
    hari: 3,
    status: 'server nyala'
  })
})

app.get('/api/products', (req: Request, res: Response) => {
  res.json({
    success: true,
    jumlah: products.length,
    data: products
  })
})

app.get('/api/product/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product tidak ditemukan'
    })
  }

  return res.status(200).json({
    success: true,
    data: product
  })
})

app.get('/api/search', (req: Request, res: Response) => {
  const { name, max_price } = req.query;
  let result = products;

  if (name) {
    result = result.filter(p => p.nama.toLowerCase().includes((name as string).toLowerCase()))
  }

  if (max_price) {
    result = result.filter(p => p.harga <= Number(max_price))
  }

  return res.status(200).json({
    success: true,
    data: result
  })
})

app.post('/api/products', (req: Request, res: Response) => {
  const { nama, deskripsi, harga } = req.body;

  const newProduct = {
    id : products.length + 1,
    nama,
    deskripsi,
    harga: Number(harga)
  }

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product berhasil ditambahkan',
    data: newProduct
  })
})

app.put('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product tidak ditemukan'
    })
  }

  products[index] = {...products[index], ...req.body}

  res.status(200).json({
    success: true,
    message: 'Product berhasil diperbarui',
    data: products[index]
  })
})

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product tidak ditemukan'
    })
  }

  const deletedProduct = products.splice(index, 1);

  res.status(200).json({
    success: true,
    message: 'Product berhasil dihapus',
    data: deletedProduct[0]
  })
})

app.listen(PORT, () => {
  console.log(`Server jalan → http://localhost:${PORT}`);
  console.log(`Coba buka semua route di atas pakai Postman!`);
});