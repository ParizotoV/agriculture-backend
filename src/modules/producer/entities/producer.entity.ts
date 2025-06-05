import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Farm } from '../../farm/entities/farm.entity';

@Entity('producers')
@Unique(['cpfCnpj'])
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'cpf_cnpj' })
  cpfCnpj!: string;

  @OneToMany(() => Farm, (farm) => farm.producer, { cascade: true })
  farms!: Farm[];
}
