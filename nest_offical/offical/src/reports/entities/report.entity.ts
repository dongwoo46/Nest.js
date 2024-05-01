import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  context: string;
}
