import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { Item } from './models/Item';


/**
 * Our "Database". In the real world, we'd be using something like MongoDB or PostgreSQL, 
 * and use an ORM like Typeorm to manage the relationship, but this tutorial's primary goal 
 * is to get you familar with how requests and servers work at a high level
 * 
 * We would have a DAO / Repo to manage this normally, but that would be a bit overkill for this app
 */
const db: Record<string, Item> = {};

export const deleteItem = (name: string) => {
  if (name in db){
    delete db[name];
    return "successful delete"
  }
  else throw new Error("item does not exists");
}
export const createItem = async (conn: Connection, name: string, price: number) => {
  const item = new Item();
  item.name = name;
  item.description = "TODO: FILL THIS OUT";
  item.price = price;
  const createdItem = await conn.manager.save(item);
  return createdItem.uuid;
};
