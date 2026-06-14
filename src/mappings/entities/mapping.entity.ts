import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('mappings')
@Unique('UQ_ID1_ID2', ['id1', 'id2'])
export class Mapping {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  id1!: string;

  @Column()
  id2!: string;

  @Column({ type: 'varchar', length: 36 })
  userId!: string;
}
