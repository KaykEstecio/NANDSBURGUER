import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();
const orderController = new OrderController();

router.use(authMiddleware);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty or insufficient stock
 */
router.post('/', (req, res) => orderController.createOrder(req, res));

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 */
router.get('/', (req, res) => orderController.getOrders(req, res));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', (req, res) => orderController.getOrderById(req, res));

/**
 * @swagger
 * /orders/admin/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All orders
 *       403:
 *         description: Forbidden
 */
router.get('/admin/all', adminMiddleware, (req, res) =>
  orderController.getAllOrders(req, res)
);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PAID, FAILED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order status updated
 *       403:
 *         description: Forbidden
 */
router.put('/:id/status', adminMiddleware, (req, res) =>
  orderController.updateOrderStatus(req, res)
);

export default router;
