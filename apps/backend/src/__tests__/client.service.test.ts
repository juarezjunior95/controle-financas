import { ClientService } from '../modules/clients/client.service';
import { prisma } from '../config/prisma';
import { clerk } from '../config/clerk';

// Tipos para os mocks
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockClerk = clerk as jest.Mocked<typeof clerk>;

describe('ClientService', () => {
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    clerkId: 'user_clerk123',
    email: 'test@example.com',
    displayName: 'Test User',
    avatarUrl: 'https://example.com/avatar.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('syncClient', () => {
    it('deve criar um novo usuário quando não existe', async () => {
      (mockPrisma.user.upsert as jest.Mock).mockResolvedValue(mockUser);

      const result = await ClientService.syncClient({
        clerkId: 'user_clerk123',
        email: 'test@example.com',
        displayName: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
      });

      expect(mockPrisma.user.upsert).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        update: {
          clerkId: 'user_clerk123',
          displayName: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        create: {
          clerkId: 'user_clerk123',
          email: 'test@example.com',
          displayName: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      });

      expect(result).toEqual(mockUser);
    });

    it('deve atualizar um usuário existente', async () => {
      const updatedUser = { ...mockUser, displayName: 'Updated Name' };
      (mockPrisma.user.upsert as jest.Mock).mockResolvedValue(updatedUser);

      const result = await ClientService.syncClient({
        clerkId: 'user_clerk123',
        email: 'test@example.com',
        displayName: 'Updated Name',
      });

      expect(result.displayName).toBe('Updated Name');
    });

    it('deve lançar erro quando o upsert falha', async () => {
      (mockPrisma.user.upsert as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        ClientService.syncClient({
          clerkId: 'user_clerk123',
          email: 'test@example.com',
        })
      ).rejects.toThrow('Falha na sincronização do usuário com o banco de dados.');
    });
  });

  describe('getByClerkId', () => {
    it('deve retornar o usuário quando encontrado', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await ClientService.getByClerkId('user_clerk123');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { clerkId: 'user_clerk123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null quando usuário não existe', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await ClientService.getByClerkId('nonexistent');

      expect(result).toBeNull();
    });

    it('deve lançar erro quando a busca falha', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(ClientService.getByClerkId('user_clerk123')).rejects.toThrow(
        'Falha ao buscar dados do usuário.'
      );
    });
  });

  describe('syncFromClerk', () => {
    const mockClerkUser = {
      id: 'user_clerk123',
      firstName: 'Test',
      lastName: 'User',
      imageUrl: 'https://example.com/avatar.jpg',
      primaryEmailAddressId: 'email_123',
      emailAddresses: [
        {
          id: 'email_123',
          emailAddress: 'test@example.com',
        },
      ],
    };

    it('deve sincronizar usuário do Clerk com banco local', async () => {
      (mockClerk.users.getUser as jest.Mock).mockResolvedValue(mockClerkUser);
      (mockPrisma.user.upsert as jest.Mock).mockResolvedValue(mockUser);

      const result = await ClientService.syncFromClerk('user_clerk123');

      expect(mockClerk.users.getUser).toHaveBeenCalledWith('user_clerk123');
      expect(mockPrisma.user.upsert).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('deve lançar erro quando usuário não tem email primário', async () => {
      const userWithoutEmail = { ...mockClerkUser, primaryEmailAddressId: null };
      (mockClerk.users.getUser as jest.Mock).mockResolvedValue(userWithoutEmail);

      await expect(ClientService.syncFromClerk('user_clerk123')).rejects.toThrow(
        'Usuário Clerk não possui email primário definido.'
      );
    });

    it('deve lançar erro quando Clerk falha', async () => {
      (mockClerk.users.getUser as jest.Mock).mockRejectedValue(new Error('Clerk API error'));

      await expect(ClientService.syncFromClerk('user_clerk123')).rejects.toThrow();
    });
  });
});
