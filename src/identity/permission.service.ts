import {
  
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { defaultPermissions } from './default-permissions';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private adapterHost: HttpAdapterHost,
    private readonly roleService: RoleService,
  ) {}

  async onModuleInit(): Promise<void> {
    // const server = this.adapterHost.httpAdapter.getHttpServer();
    // const router: Router = server._events.request._router;
    // console.error()
    // await this.checkAdminRole(router);

    // const roles = Object.keys(defaultPermissions);
    // for await (const role of roles) {
    //   await this.checkEachDefaultRolePermissions(role);
    // }

    await this.resetPermissionsCache();
  }

  private async checkEachDefaultRolePermissions(role: string) {
    const roleObject = await this.roleService.getRole(role);
    const permissions = defaultPermissions[role];
    for await (const permission of permissions) {
      await this.checkEachPermission(permission, roleObject);
    }
  }

  private async checkEachPermission(
    permission: Record<string, string[]>,
    roleObject: Role,
  ) {
    const paths = Object.keys(permission);
    for await (const path of paths) {
      const methods = permission[path];
      for await (const method of methods) {
        await this.checkPermissionMethod(method, path, roleObject);
      }
    }
  }

  private async checkPermissionMethod(
    method: string,
    path: string,
    roleObject: Role,
  ) {
    const foundPermission = await this.permissionRepository.findOne({
      where: { method, path },
    });
    if (!foundPermission) {
      const newPermission = new Permission(path, method);
      newPermission.roles = [roleObject];
      await this.permissionRepository.save(newPermission);
    } else {
      foundPermission.roles.push(roleObject);
      await this.permissionRepository.save(foundPermission);
    }
  }

  // private async checkAdminRole(router: Router) {
  //   const adminRole = await this.roleService.getRole('admin');
  //   console.error(router)
  //   for await (const layer of router.stack) {
  //     if (layer.route) {
  //       const path = layer.route?.path;
  //       const method = layer.route?.stack[0].method.toUpperCase();
  //       const permission = await this.permissionRepository.findOne({
  //         where: { method, path },
  //       });
  //       if (!permission) {
  //         const newPermission = new Permission(path, method);
  //         newPermission.roles = [adminRole];
  //         await this.permissionRepository.save(newPermission);
  //       }
  //     }
  //   }
  // }

  private async resetPermissionsCache() {
    const permissionsObject = {};
    const permissions = await this.permissionRepository.find();
    permissions.forEach((permission) => {
      permission.roles.forEach((role) => {
        if (!permissionsObject[role.title]) {
          permissionsObject[role.title] = [];
        }
        permissionsObject[role.title].push({
          path: permission.path,
          method: permission.method,
        });
      });
    });
    await this.cacheManager.set('permissionList', permissionsObject, {
      ttl: 0,
    });

    return permissionsObject;
  }

  async check(
    userRole: string,
    path: string,
    method: string,
  ): Promise<boolean> {
    if (path.includes('?')) path = path.split('?')[0];
    let permissionsObject = await this.cacheManager.get('permissionList');
    if (!permissionsObject) return false;
    if (Object.keys(permissionsObject).length === 0) {
      permissionsObject = await this.resetPermissionsCache();
    }
    if (!permissionsObject[userRole]) return false;
    const roles: { path: string; method: string }[] =
      permissionsObject[userRole];
    if (roles.length == 0) return false;
    return roles.some((role) => {
      const isPathOk =
        role.path === path ||
        (role.path.endsWith('*') && path.includes(role.path.replace('*', '')));
      if (isPathOk)
        return (
          role.method === '*' ||
          role.method.toUpperCase() === method.toUpperCase()
        );
    });
  }
}
