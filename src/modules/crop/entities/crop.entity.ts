import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Farm } from '../../farm/entities/farm.entity';

@Entity('crops')
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'season', length: 50 })
  season!: string;

  @Column({ name: 'culture_name', length: 50 })
  cultureName!: string;

  @ManyToOne(() => Farm, (farm) => farm.crops, { onDelete: 'CASCADE' })
  farm!: Farm;

  @Column({ name: 'farm_id' })
  farmId!: string;
}
