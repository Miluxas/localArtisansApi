import {
  Column,
  Entity,
  JoinColumn, OneToOne
} from "typeorm";
import { BaseModel } from "../../common/base-model";
import { Identity } from "../../identity/entities/identity.entity";
import { Gender } from "./user.enums";

@Entity()
export class User extends BaseModel {
  @OneToOne(() => Identity, { cascade: true, eager: true })
  @JoinColumn({ name: "IdentityId" })
  identity?: Identity;

  @Column({ length: 80 })
  firstName: string;

  @Column({ length: 80 })
  lastName: string;

  @Column({})
  email: string;

  @Column({ nullable: true })
  birthDate?: Date;

  @Column({
    type: "enum",
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @Column({ nullable: true, length: 800 })
  bio?: string;

  @Column({ nullable: true, length: 100 })
  location?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  status: string;
}
