import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  email: string;

  @Column()
  @Length(64)
  password: string;

  @Column()
  @ApiProperty()
  first_name: string;

  @Column()
  @ApiProperty()
  last_name: string;

  @Column()
  @ApiProperty()
  is_active: number;

  @Column({ default: 1 })
  @ApiProperty()
  role: number;

  @Column({ nullable: true })
  @ApiProperty()
  reset_token: string;

  @CreateDateColumn({ nullable: true })
  @ApiProperty()
  reset_expiry_time: Date;

  @Column({ nullable: true })
  @Length(6)
  otp: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  generateUUID() {
    this.id = uuidv4();
  }
}
