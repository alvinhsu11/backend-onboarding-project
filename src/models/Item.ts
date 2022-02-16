import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './Order';


@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column('varchar', { length: 255 })
  name: string

  @Column('varchar', { length: 255 })
  description: string

  @Column({ type: 'float' })
  price: number

  @OneToMany(() => Order, o => o.item, {
    onDelete: 'CASCADE'
  })
  orders: Order[]

}