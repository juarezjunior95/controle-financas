import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { CategoryService } from './categories.service';
import { log } from 'console';

export class CategoriesController {

    // POST /api/v1/categories
    // Criar nova categoria para o usuário logado

    static async create(req: Request, res: Response) {
        try {
            const auth = getAuth(req);
            const clerkId = auth.userId;

            if (!clerkId) {
                return res.status(401).json({
                    error: 'O usuário não está autenticado',
                });
            }

            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    error: 'Nome da categoria é obrigatório',
                });
            }

            const category = await CategoryService.create(clerkId, name);

            return res.status(201).json({
                data: category,
                message: 'Categoria criada com sucesso',
            });
        } catch (error: any) {
            const statusCode = error?.message?.includes('não encontrado') ? 404 : 500;
            return res.status(statusCode).json({
                error: 'Erro ao criar categoria',
                details: error?.message || 'Erro desconhecido',
            });
        }
    }


    // * GET /api/v1/categories
    // * Listar categorias do usuário + categorias do sistema

    static async findAll(req: Request, res: Response) {
        try {
            const auth = getAuth(req);
            const clerkId = auth.userId;

            if (!clerkId) {
                return res.status(401).json({
                    error: 'Usuário não autenticado',
                });
            }

            const categories = await CategoryService.list(clerkId);

            return res.status(200).json({
                data: categories,
            });
        } catch (error: any) {
            const statusCode = error?.message?.includes('não encontrado') ? 404 : 500;
            return res.status(statusCode).json({
                error: 'Erro ao listar categorias',
                details: error?.message || 'Erro desconhecido',
            });
        }
    }
}
