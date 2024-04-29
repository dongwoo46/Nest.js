import { Column, PrimaryColumn } from 'typeorm';

export class Article {
  @PrimaryColumn()
  id: number;
  @Column()
  isPublished: boolean;
  @Column()
  authorId: number;
  @Column()
  context: string;
}
