import app from './app';
import { PORT, APP_URL } from './utils/env';

app.listen(PORT, () => {
  console.log(`Server MVC + Service E-Commerce jalan di ${APP_URL}`);
  console.log(`Using DATABASE_URL: ${process.env.DATABASE_URL}`);
});