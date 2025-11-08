import express from 'express';
import cors from 'cors';
import routes from './src/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    // origin: 'http://localhost:8080'
    origin: '*'
}));
app.use(express.json());

// Gunakan routes
app.use(routes);

// Listen server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;