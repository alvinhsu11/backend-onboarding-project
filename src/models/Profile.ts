import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column('varchar', { length: 255 } )
  username: string 

  @Column('varchar', { length: 255} )
  password: string
}