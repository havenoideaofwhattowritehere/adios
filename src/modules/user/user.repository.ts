import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { REPOSITORIES } from '../../shared/helpers/repositories';
import { USER_INCLUDE } from './entities/user.include';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UUID } from '../../shared/common/interfaces/types';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(REPOSITORIES.USER) private usersRepository: typeof User,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    transaction?: Transaction,
  ): Promise<User> {
    const createUser = {
      ...createUserDto,
      birthday: createUserDto.birthday
        ? new Date(createUserDto.birthday)
        : null,
    };
    return this.usersRepository.create<User>(createUser, {
      include: USER_INCLUDE.create(),
      transaction,
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll({
      include: USER_INCLUDE.getAll(),
    });
  }

  async findAllByIds(ids: UUID[]): Promise<User[]> {
    return this.usersRepository.findAll({
      where: { id: ids },
      include: USER_INCLUDE.getAll(),
    });
  }

  async findOne(id: UUID): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      include: USER_INCLUDE.getOne(),
    });
  }

  async findByAuth0UserId(auth0UserId: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { auth0UserId },
      include: USER_INCLUDE.getOne(),
    });
  }

  async findUserByPhone(phone: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { phone },
      include: USER_INCLUDE.getOne(),
    });
  }

  async findParanoid(id: UUID): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      include: USER_INCLUDE.getOne(),
      paranoid: false,
    });
  }

  async update(
    id: UUID,
    updateUserDto: UpdateUserDto,
    transaction?: Transaction,
  ): Promise<boolean> {
    const updateUser = {
      ...updateUserDto,
      birthday: updateUserDto.birthday
        ? new Date(updateUserDto.birthday)
        : null,
    };
    const user = await this.usersRepository.update(updateUser, {
      where: { id },
      transaction,
    });
    return Boolean(user[0]);
  }

  async remove(id: UUID, transaction?: Transaction): Promise<boolean> {
    const user = await this.usersRepository.destroy({
      where: { id },
      transaction,
    });
    return Boolean(user);
  }

  async removeUsers(ids: UUID[], transaction?: Transaction): Promise<boolean> {
    const user = await this.usersRepository.destroy({
      where: { id: ids },
      transaction,
    });
    return Boolean(user);
  }
}
