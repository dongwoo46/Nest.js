import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: true })
  isPublished: boolean;
  @Column({ nullable: true })
  authorId: number;
  @Column()
  context: string;
  @Column()
  title: string;
}