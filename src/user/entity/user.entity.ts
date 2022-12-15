import { Exclude } from 'class-transformer';
import { Posts } from 'src/community/entity/post.entity';
import { Reply } from 'src/community/entity/reply.entity';
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
  @Exclude()
  email: string;

  @Column()
  money: number;

  @OneToMany(() => Posts, (post) => post.user)
  post: Posts[];

  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply;
}
