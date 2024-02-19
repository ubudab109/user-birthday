import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { UserUpdateRequestDTO } from "../dto/user_update.dto";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * The `createUser` method in the `UserService` class is a public asynchronous function that is
  responsible for creating a new user in the database. Here is a breakdown of what it does:
   * @param {User} user 
   * @returns {Promise<User | null>}
   */
  public createUser = async (user: User): Promise<User | null> => {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const savedUser = await this.userRepository.save(user);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * The `deleteUser` method in the `UserService` class is a public asynchronous function that takes a
  `userId` of type number as a parameter.
   * @param {number} userId 
   * @returns {Promise<boolean>}
   */
  public deleteUser = async (userId: number): Promise<boolean> => {
    const isUserExists = await this.userRepository.findOneBy({ id: userId });
    if (!isUserExists) {
      return false;
    } else {
      await this.userRepository.delete(userId);
      return true;
    };
  }

  /**
   * The `updateUser` method in the `UserService` class is a public asynchronous function that takes
  two parameters: `userId` of type number and `data` of type `UserUpdateRequestDTO`
   * @param {number} userId 
   * @param {UserUpdateRequestDTO} data 
   * @returns {Promise<User | null>}
   */
  public updateUser = async (userId: number, data: UserUpdateRequestDTO): Promise<User | null> => {
    const isUserExists = await this.userRepository.findOneBy({ id: userId });
    if (!isUserExists) return null;
    Object.assign(isUserExists, data);
    return this.userRepository.save(isUserExists);
  }
}