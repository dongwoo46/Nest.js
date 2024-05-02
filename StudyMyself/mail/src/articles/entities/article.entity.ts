import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  context: string;
  @Column({ nullable: true })
  name: string;
}
