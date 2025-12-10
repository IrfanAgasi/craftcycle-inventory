import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, restoreUser } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/restore', restoreUser);

export default router;
