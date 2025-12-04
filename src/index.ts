import app from './app';
import { PORT } from './utils/env';

app.listen(PORT, () => {
  console.log(`Server MVC + Service E-Commerce jalan di http://localhost:${PORT}`);
});