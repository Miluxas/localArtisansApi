import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "../../common/base-model";
import { User } from "../../user/entities/user.entity";

class Property {
  name: string;
  type: string;
}

class Event {
  name: string;
  param?: Record<string, string>;
  state?: Record<string, any>;
  notification?: { to: string; title: string; content: string };
}

class Command {
  name: string;
  params?: { name: string; type: string; property?: Record<string, string> }[];
  returnType?: string;
}

@Entity()
export class Product extends BaseModel {
  @ManyToOne(() => User)
  owner: User;

  @Column()
  title: string;

  @Column({ type: "json", nullable: true })
  abi?: { properties?: Property[]; events?: Event[]; commands?: Command[] };

  @Column({ type: "uuid" })
  publicKey: string;

  @Column({ nullable: true, select: false })
  privateKey: string;

  @Column({})
  isActive: boolean;

  @Column({ type: "json", nullable: true })
  state?: any;
}
