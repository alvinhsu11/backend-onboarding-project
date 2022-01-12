import { v4 } from 'uuid';


interface Item {
  name: string,
  price: number,
  uuid: string
}

/**
 * Our "Database". In the real world, we'd be using something like MongoDB or PostgreSQL, 
 * and use an ORM like Typeorm to manage the relationship, but this tutorial's primary goal 
 * is to get you familar with how requests and servers work at a high level
 * 
 * We would have a DAO / Repo to manage this normally, but that would be a bit overkill for this app
 */
const db: Record<string, Item> = {};

export const createItem = (name: string, price: number) => {
  if (name in db) {
    throw new Error('item already exists!');
  }
  db[name] = {
    name,
    price,
    uuid: v4()
  };
  return db[name].uuid;
};

export const deleteItem = (name: string) => {
  if (name in db){
    delete db[name];
    return "successful delete"
  }
  else throw new Error("item does not exists");
}