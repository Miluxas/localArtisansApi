import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { In, IsNull, Not, Repository } from "typeorm";
import { ActionType, InnerActivity } from "../activity-log/types/activity.type";
import { IUserInfo } from "../auth/interfaces";
import { AdminRole } from "../common/admin-role.constant";
import { ListBody } from "../common/listBody.type";
import { PaginatedList } from "../common/paginated-list.type";
import { Role } from "../common/user-role.constant";
import { findAndPaginate } from "../helpers/pagination-formatter";
import { IdentityType } from "../identity/identity-type.constant";
import { IdentityService } from "../identity/identity.service";
import { User } from "./entities/user.entity";
import {
  IInitUser,
  IRegisterNewUser,
  IUser,
  IUserFullInfo
} from "./interfaces";
import { UserError } from "./user.error";

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    protected readonly configService: ConfigService,
    private readonly identityService: IdentityService,
  ) {}

  async onModuleInit(): Promise<void> {
    // this.searchService.init("users").catch((e) => {});
    const defaultAdminEmail: string =
      this.configService.get("DEFAULT_ADMIN_EMAIL") ?? "admin@gmail.com";
    const defaultAdminPassword: string =
      this.configService.get("DEFAULT_ADMIN_PASSWORD") ?? "123456";
    await this.createUser(
      defaultAdminEmail,
      defaultAdminPassword,
      "admin",
      "admin",
      IdentityType.Admin
    ).catch(() => {
      // nothing
    });

    // await this.searchService.deleteIndex();

    // await this.userRepository
    //   .find({})
    //   .then(async (list) => {
    //     if (list.length > 0)
    //       await this.searchService.indexMany(list).catch(console.error);
    //   })
    //   .catch((e) => console.error(e));
  }

  private async createUser(
    email: string,
    password: string,
    role: string,
    name: string,
    type: IdentityType
  ): Promise<void> {
    const adminIdentity = await this.identityService.registerUser(
      email,
      password,
      role,
      type,
      true
    );
    const defaultAdmin = new User();
    defaultAdmin.firstName = name;
    defaultAdmin.lastName = name;
    defaultAdmin.identity = adminIdentity;
    defaultAdmin.email = email;
    await this.userRepository.save(defaultAdmin);
  }

  public async create(newUser: IRegisterNewUser): Promise<IUserInfo> {
    const identity = await this.identityService.registerUser(
      newUser.email,
      newUser.password,
      newUser.role,
      IdentityType.User,
      false
    );
    const user = new User();
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;
    user.email = newUser.email;
    user.identity = identity;
    await this.userRepository.insert(user);

    const loggedInUser = this.getUserInfo(user);
    if (newUser.role == Role.Normal) {
      // await this.indexElasticSearch(user.id);
    }
    return loggedInUser;
  }

  public async createNewUser(newUser: IRegisterNewUser): Promise<IUserInfo> {
    const password = this.configService.get("DEFAULT_USER_PASSWORD");
    return this.create({
      ...newUser,
      password,
    });
  }

  // public async updateElasticSearch(id: number) {
  //   this.getUserInfoForElastic(id).then((user) => {
  //     this.searchService.remove(id).then(() => {
  //       this.searchService.index(user);
  //     });
  //   });
  // }

  // public async indexElasticSearch(id: number) {
  //   this.getUserInfoForElastic(id).then((user) => {
  //     this.searchService.index(user);
  //   });
  // }

  public async verifyUser(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    user.identity.emailVerified = true;
    await this.userRepository.save(user);

    return user;
  }

  public findUserByIdentityId(identityId: number): Promise<User> {
    return this.userRepository.findOneBy({ identity: { id: identityId } });
  }

  public getUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({
      id,
    });
  }

  public async list(listBody: ListBody): Promise<PaginatedList<any> | void> {
    console.error(
      "%cuser.service.ts line:184 listBody",
      "color: #007acc;",
      listBody
    );
    return findAndPaginate(
      this.userRepository,
      listBody,
      {},
      this.getUserInfo,
      ["firstName", "lastName", "email"],
      [
        "services",
        "services.packages",
        "services.category",
        "languages",
        "skills",
        "financialAccounts",
        "linkedAccounts",
        "experiences",
        "educations",
      ]
    );
  }

  public async setUserActivation(id: number, active: boolean): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    const result = await this.identityService.setUserActivation(
      user.identity.id,
      active
    );

    return result;
  }

  public async registerNewAdmin(email: string, role: AdminRole): Promise<User> {
    const identity = await this.identityService.registerUser(
      email,
      null,
      role,
      IdentityType.Admin,
      false
    );
    const user = new User();
    user.firstName = "";
    user.lastName = "";
    user.email = email;
    user.identity = identity;
    await this.userRepository.insert(user);
    const loggedInUser = this.getUserInfo(user);

    return user;
  }

  public async adminList(listBody: ListBody): Promise<PaginatedList<any>> {
    return findAndPaginate(
      this.userRepository,
      listBody,
      {
        identity: {
          role: {
            title: In([
              AdminRole.FinancialManager,
              AdminRole.Admin,
              AdminRole.SystemManager,
            ]),
          },
        },
      },
      this.getUserInfo,
      ["firstName", "lastName", "email"]
    );
  }

  public getUserInfo(user: User): IUserInfo {
    const { identity, ...justUser } = user;
    return {
      ...justUser,
      emailVerified: identity.emailVerified,
      role: identity.role.title,
      status: identity.active ? "Active" : "Inactive",
      type: identity.type,
    };
  }

  public getUserFullInfo(user: User): IUserFullInfo {
    const { identity, ...justUser } = user;
    return {
      ...justUser,
      emailVerified: identity.emailVerified,
      role: identity.role.title,
      status: identity.active ? "Active" : "Inactive",
      type: identity.type,
    };
  }

  public async detail(id: number): Promise<IUserFullInfo> {
    return this.userRepository
      .findOne({
        where: {
          id,
        },
      })
      .then(this.getUserFullInfo)
      .catch(() => {
        throw new Error(UserError.NOT_FOUND);
      });
  }

  public async update(id: number, newValue: IUser): Promise<IUserFullInfo> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new Error(UserError.NOT_FOUND);
    }
    Object.assign(user, newValue);
    await this.userRepository.save(user);

    return this.userRepository
      .findOneBy({ id: user.id })
      .then(this.getUserFullInfo);
  }

  private async getUserInfoForElastic(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  public async init(id: number, newValue: IInitUser): Promise<IUserFullInfo> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new Error(UserError.NOT_FOUND);
    }
    Object.assign(user, newValue);
    await this.userRepository.save(user);

    return this.detail(id);
  }

  public getUserNormalInfo(user: User) {
    const { identity, ...justUser } = user;
    return {
      ...justUser,
      salesCount: 0,
      status: identity.active ? "Active" : "Inactive",
    };
  }

  public async userNormalList(
    listBody: ListBody
  ): Promise<PaginatedList<any> | void> {
    // if (listBody.searchQuery?.length) {
    //   const list = await this.searchService
    //     .search(
    //       listBody,
    //       ["firstName", "lastName", "email"],
    //       this.getUserNormalInfo
    //     )
    //     .catch((e) => console.error(e));
    //   if (list !== undefined) return list;
    // }
    return findAndPaginate(
      this.userRepository,
      listBody,
      {
        identity: {
          role: {
            title: Role.Normal,
          },
        },
        services: [{ id: Not(IsNull()) }],
      },
      this.getUserNormalInfo,
      ["firstName", "lastName", "email"]
    );
  }

  public async userNormalDetail(id: number) {
    return this.userRepository
      .findOne({
        where: {
          id,
        },
      })
      .then(this.getUserFullInfo)
      .catch(() => {
        throw new Error(UserError.NOT_FOUND);
      });
  }

  public async setRateAverage(id: number) {
    this.userRepository
      .findOne({
        where: {
          id,
        },
        relations: ["services.packages.reviews"],
      })
      .then((user) => {
        this.userRepository.save(user);
      });
  }

  private calculate(items: { rateAverage: number }[]) {
    return (
      items.reduce(
        (previousValue, currentValue) =>
          previousValue + (currentValue.rateAverage ?? 0),
        0
      ) / (items.filter((service) => service.rateAverage).length ?? 1)
    );
  }

  public async registerExternalUser(newUser: IRegisterNewUser): Promise<IUserInfo> {
    const identity = await this.identityService.registerUser(
      newUser.email,
      newUser.password,
      newUser.role,
      IdentityType.User,
      true,
    );
    const user = new User();
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;
    user.email = newUser.email;
    user.identity = identity;
    await this.userRepository.insert(user);

    const loggedInUser = this.getUserInfo(user);

    return loggedInUser;
  }
}
