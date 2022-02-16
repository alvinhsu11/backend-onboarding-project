import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Item } from './Item'

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column('varchar', { length: 255})
  itemId: string

  @Column('varchar', { length: 255})
  userId: string

  @Column('varchar', {length: 255})
  createdAt: string

  @ManyToOne(() => Item, i => i.orders, {
    onDelete: "CASCADE"
  })
  item: Item;

}