import { body, param } from "express-validator";
import { UserController } from "../controllers/user.controller";
import { RoutesI } from "../interfaces/route.interface";
import { timezones } from "../utils/timezone";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Not } from "typeorm";

export const Routes: Array<RoutesI> = [
  {
    method: 'get',
    route: '/api/users',
    action: 'test',
    controller: UserController,
    validation: []
  },
  {
    method: 'post',
    route: '/api/users',
    action: 'create',
    controller: UserController,
    validation: [
      body('firstname').notEmpty().isString(),
      body('lastname').notEmpty().isString(),
      body('email').isEmail().custom(async (email: string) => {
        const repository = AppDataSource.getRepository(User);
        if (await repository.findOneBy({email: email})) {
          throw new Error('Email already exists');
        } else {
          return true;
        }
      }),
      body('birthday_date')
        .notEmpty().withMessage('Birthday date is required')
        .isISO8601().toDate().withMessage('Invalid date format. Please use YYYY-MM-DD'),
      body('location')
        .notEmpty().withMessage('Location is required')
        .isString().withMessage('Location must be a string')
        .custom(value => {
          if (!timezones.includes(value)) {
            throw new Error('Invalid timezone');
          }
          return true;
        }),
    ]
  },
  {
    method: 'delete',
    route: '/api/users/:id',
    action: 'delete',
    controller: UserController,
    validation: [
      param('id').notEmpty().isNumeric().withMessage('ID User is required')
    ]
  },
  {
    method: 'put',
    route: '/api/users/:id',
    action: 'update',
    controller: UserController,
    validation: [
      param('id').notEmpty().isNumeric().withMessage('ID User is required'),
      body('firstname').notEmpty().isString(),
      body('lastname').notEmpty().isString(),
      body('email').isEmail().custom(async (email: string, {req}) => {
        const repository = AppDataSource.getRepository(User);
        if (await repository.findOne({
          where: { email: email,  id: Not(parseInt(req.params?.id))}
        })) {
          throw new Error('Email already exists');
        } else {
          return true;
        }
      }),
      body('birthday_date')
        .notEmpty().withMessage('Birthday date is required')
        .isISO8601().toDate().withMessage('Invalid date format. Please use YYYY-MM-DD'),
      body('location')
        .notEmpty().withMessage('Location is required')
        .isString().withMessage('Location must be a string')
        .custom(value => {
          if (!timezones.includes(value)) {
            throw new Error('Invalid timezone');
          }
          return true;
        }),
    ]
  },
];