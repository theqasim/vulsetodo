import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use('/api', todoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
