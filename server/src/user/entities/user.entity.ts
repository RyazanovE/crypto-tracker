import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, UpdateDateColumn, CreateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
  
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role;
  
  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Portfolio, (portfolio) => portfolio.user, { cascade: true })
  portfolio: Portfolio 

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
