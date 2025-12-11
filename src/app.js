import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorMiddleware.js';

import userRoutes from './routes/userRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import eventRegistrationRoutes from './routes/eventRegistrationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/event-registrations', eventRegistrationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get('/', (req, res) => {
  res.send('ClubSphere API is running...');
});

// Error Handling
app.use(errorHandler);

export default app;
