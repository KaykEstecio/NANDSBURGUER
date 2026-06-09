import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'E-Commerce API',
        version: '1.0.0',
        description: 'Complete e-commerce API documentation'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3001}`,
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    },
    apis: ['./src/routes/*.ts']
  };

  const specs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

  app.use('/auth', authRoutes);
  app.use('/products', productRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/cart', cartRoutes);
  app.use('/orders', orderRoutes);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
