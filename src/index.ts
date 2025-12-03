import express, { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
dotenv.config();

// config express
const app = express();
const PORT = process.env.PORT || 5000;

interface CustomRequest extends Request {
  startTime?: number;
}

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
})

app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Header X-API-Key wajib diisi untuk akses API!"
    });
  }
  // Simulasi validasi API key (dalam produksi, cek ke database)
  if (apiKey !== 'secret-api-key-123') {
    return res.status(403).json({
      success: false,
      message: "API Key tidak valid!"
    });
  }
  next();
});

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
}

// in memory database
let products: Product[] = [
  { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000 },
  { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000 },
  { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000 }
];

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  errors?: Array<{
    field: string;
    message: string;
  }> | { stack?: string };
}

const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  pagination: { page: number; limit: number; total: number } | null = null,
  statusCode: number = 200
) => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;

  return res.status(statusCode).json(response);
};

// Error Response Helper
const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: Array<{ field: string; message: string }> | { stack?: string } | null = null
) => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

// bikin validator
const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map((err: { type: string; path?: string; msg: string }) => ({
      field: err.type === 'field' ? (err.path ?? 'unknown') : 'unknown',
      message: err.msg
    }));

    return errorResponse(res, 'Validasi gagal', 400, errorList);
  };
}

// validator create dan updat3
const createProductValidator = validate([
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama produk wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),

  body('deskripsi')
    .trim()
    .notEmpty().withMessage('Deskripsi wajib diisi'),

  body('harga')
    .trim()
    .notEmpty().withMessage('Harga wajib diisi')
    .isNumeric().withMessage('Harga harus angka')
    .custom(value => value > 0).withMessage('Harga harus lebih dari 0')]
)

// Validasi untuk GET by ID produk
const getProductByIdValidation = [
  param('id')
    .isNumeric().withMessage('ID harus angka')
];


// home
app.get('/', (req: CustomRequest, res: Response) => {
  const waktuProses = Date.now() - (req.startTime || Date.now());
  successResponse(res, 'Selamat datang di e-commerce', {
    message: 'Selamat datang di e-commerce',
    hari: 4,
    status: 'server nyala',
    waktuProses: `${waktuProses} ms`
  }, null, 200)
})

app.get('/api/products', (req: Request, res: Response) => {
  successResponse(res, 'Daftar Produk', products)
})

app.get('/api/products/:id', getProductByIdValidation, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    // return errorResponse(res, 'Product tidak ditemukan', 404)
    throw new Error('Produk dengan ID tersebut tidak ditemukan');
  }

  return successResponse(res, 'Product ditemukan', product)
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

  return successResponse(res, 'Hasil pencarian', result)
})

app.post('/api/products', createProductValidator, (req: Request, res: Response) => {
  const { nama, deskripsi, harga } = req.body;

  const newProduct = {
    id: products.length + 1,
    nama: String(nama),
    deskripsi: String(deskripsi),
    harga: Number(harga)
  }

  products.push(newProduct);

  return successResponse(res, 'Produk berhasil ditambahkan', newProduct, null, 201);
})

app.put('/api/products/:id', createProductValidator, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return errorResponse(res, 'Product tidak ditemukan', 404)
  }

  products[index] = { ...products[index], ...req.body }

  return successResponse(res, 'Product berhasil diperbarui', products[index], null, 200);
})

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return errorResponse(res, 'Product tidak ditemukan', 404)
  }

  const deletedProduct = products.splice(index, 1);

  return successResponse(res, 'Product berhasil dihapus', deletedProduct[0], null, 200);
})

// eror handling global
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }
}

app.get('/api/test-async', asyncHandler(async (req: Request, res: Response) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  successResponse(res, "Async berhasil!");
}));

// Catch-all untuk route yang tidak ditemukan (harus di paling bawah sebelum error handler)
app.use((req: Request, res: Response) => {
  throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('ERROR:', err.message);

  // Kalau error validasi dari express-validator sudah ditangani di `validate` middleware.
  // Ini untuk error umum lain atau error yang kita `throw` manual.
  const statusCode = err.message.includes('tidak ditemukan') ? 404 : 400;

  errorResponse(res, err.message || 'Terjadi kesalahan server', statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
});

app.listen(PORT, () => {
  console.log(`Server E-Commerce HARI 4 jalan di http://localhost:${PORT}`);
  console.log(`Jangan lupa kirim header: X-API-Key: secret-api-key-123`);
});