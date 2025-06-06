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

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  harvestQuantity!: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  priceReceived!: number;

  @ManyToOne(() => Farm, (farm) => farm.crops, { onDelete: 'CASCADE' })
  farm!: Farm;

  @Column({ nullable: true, default: null })
  farmId!: string;
}
