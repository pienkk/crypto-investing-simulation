import { Posts } from 'src/community/entity/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  description: string;

  @Column()
  email: string;

  @Column()
  money: number;

  @OneToMany(() => Posts, (post) => post.user)
  post: Posts[];
}
