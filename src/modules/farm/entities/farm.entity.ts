import { Check, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Crop } from '../../crop/entities/crop.entity';
import { Producer } from '../../producer/entities/producer.entity';

@Entity('farms')
@Check(`"agricultural_area" + "vegetation_area" <= "total_area"`)
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column({ name: 'total_area', type: 'numeric' })
  totalArea!: number;

  @Column({ name: 'agricultural_area', type: 'numeric' })
  agriculturalArea!: number;

  @Column({ name: 'vegetation_area', type: 'numeric' })
  vegetationArea!: number;

  @ManyToOne(() => Producer, (producer) => producer.farms, {
    onDelete: 'CASCADE',
  })
  producer!: Producer;

  @Column({ name: 'producer_id' })
  producerId!: string;

  @OneToMany(() => Crop, (crop) => crop.farm, { cascade: true })
  crops!: Crop[];
}
