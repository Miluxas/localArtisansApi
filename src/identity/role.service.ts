import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getRole(title: string): Promise<Role> {
    const existedRole = await this.roleRepository.findOne({
      where: {
        title: title,
      },
    });
    if (existedRole) {
      return existedRole;
    } else {
      const newRole = new Role(title);
      await this.roleRepository.save(newRole);
      return newRole;
    }
  }

  findRole(title: string): Promise<Role> {
    return this.roleRepository.findOneBy({
      title: title,
    });
  }

  list(): Promise<Role[]> {
    return this.roleRepository.find({ relations: { permissions: true } });
  }
}
