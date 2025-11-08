import express from 'express';
import cors from 'cors';
import routes from './src/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// Gunakan routes
app.use(routes);

// Listen server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;