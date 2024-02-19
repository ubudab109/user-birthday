import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { User } from "../entities/User";
import { Helper } from "../utils/helper";
import { UserUpdateRequestDTO } from "../dto/user_update.dto";
import { ResponseI } from "../interfaces/response.interface";

export class UserController {
  private services: UserService;

  constructor() {
    this.services = new UserService();
  }

  /**
   * The `create` method in the `UserController` class is responsible for handling the creation
  operation for a user entity. Here is a breakdown of what it does: 
   * @param {Request} req 
   * @param _ 
   * @returns {Promise<ResponseI>}
   */
  public create = async (req: Request, _: Response): Promise<ResponseI> => {
    const userReqData = req.body as User;
    const userCreateService = await this.services.createUser(userReqData);
    if (userCreateService === null) {
      return Helper.createResponse(500, 'Internal server error', null);
    } else {
      return Helper.createResponse(201, 'User Data Created Successfully', userCreateService);
    }
  }

  /**
   * The `delete` method in the `UserController` class is responsible for handling the deletion
  operation for a user entity. Here is a breakdown of what it does:
   * @param {Request} req 
   * @param _ 
   * @returns {Promise<ResponseI>}
   */
  public delete = async (req: Request, _: Response): Promise<ResponseI> => {
    const userId = req.params.id;
    const userDeleteService = await this.services.deleteUser(parseInt(userId));
    if (!userDeleteService) return Helper.createResponse(404, 'User not found or already deleted', null);
    else return Helper.createResponse(204, 'User Deleted Successfully', null);
  }

  /**
   * The `update` method in the `UserController` class is responsible for handling the update operation
  for a user entity. Here is a breakdown of what it does:
   * @param {Request} req 
   * @param _ 
   * @returns {Promise<ResponseI>}
   */
  public update = async (req: Request, _: Response): Promise<ResponseI> => {
    const userId = req.params.id;
    const userReqData = req.body as UserUpdateRequestDTO;
    const userUpdateService = await this.services.updateUser(parseInt(userId), userReqData);
    if (userUpdateService === null) return Helper.createResponse(404, 'User not found or already deleted', null);
    else return Helper.createResponse(201, 'User Updated Successfully', userUpdateService);
  }
}