import { Router } from 'express';
import { CategoriesController } from './categories.controller';
const { requireAuthentication } = require('../../middleware/auth.middleware');

const router = Router();

// Endpoint: /api/v1/categories
router.post('/', requireAuthentication, CategoriesController.create);
router.get('/', requireAuthentication, CategoriesController.findAll);

export default router;