import { UserService } from '../src/services/user.service';
import { User } from '../src/entities/User';
import { Repository } from 'typeorm';
import { AppDataSource } from '../src/data-source';
import { UserUpdateRequestDTO } from '../src/dto/user_update.dto';

jest.mock('../src/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    createQueryRunner: jest.fn(() => ({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    })),
  },
}));


describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: Repository<User>;

  beforeEach(() => {
    // Mocking the repository
    mockUserRepository = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
    } as unknown as Repository<User>;

    // Setting up the mock
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepository);

    userService = new UserService();
  });

  it('should create a user successfully', async () => {
    const user = new User();
    user.id = 1;
    user.firstname = 'John';
    user.lastname = 'Doe';
    user.email = 'test@test.com';
    user.location = 'Asia/Jakarta';
    user.birthday_date = new Date('1999-10-14');

    jest.spyOn(mockUserRepository, 'save').mockResolvedValueOnce(user);

    const result = await userService.createUser(user);

    expect(result).toEqual(user);
  });

  it('should delete a user successfully', async () => {
    const userId = 1;
    const mockUser = new User();
    mockUser.id = userId;

    jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValueOnce(mockUser);
    jest.spyOn(mockUserRepository, 'delete').mockResolvedValueOnce({} as any);

    const result = await userService.deleteUser(userId);

    expect(result).toBe(true);
  });

  it('should not delete a user if user does not exist', async () => {
    const userId = 1;

    jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValueOnce(null);

    const result = await userService.deleteUser(userId);

    expect(result).toBe(false);
  });

  it('should update a user successfully', async () => {
    const userId = 1;
    const updateUserDTO: UserUpdateRequestDTO = {
      firstname: 'UpdatedJohn',
    };

    const mockUser = new User();
    mockUser.id = userId;
    mockUser.firstname = 'John';
    mockUser.lastname = 'Doe';
    mockUser.email = 'test@test.com';
    mockUser.location = 'Asia/Jakarta';
    mockUser.birthday_date = new Date('1999-10-14');

    jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValueOnce(mockUser);
    jest.spyOn(mockUserRepository, 'save').mockResolvedValueOnce({ ...mockUser, ...updateUserDTO } as User);

    const result = await userService.updateUser(userId, updateUserDTO);

    expect(result).toEqual({ ...mockUser, ...updateUserDTO });
  });

  it('should return null when trying to update a non-existing user', async () => {
    const userId = 1;
    const updateUserDTO: UserUpdateRequestDTO = {
      firstname: 'UpdatedJohn',
    };

    jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValueOnce(null);

    const result = await userService.updateUser(userId, updateUserDTO);

    expect(result).toBeNull();
  });
});
