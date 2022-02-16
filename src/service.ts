import { connect } from 'http2';
import { ColumnTypeUndefinedError, Connection, ConnectionOptionsReader, GridFSBucketReadStream } from 'typeorm';
import { v4 } from 'uuid';
import { Item } from './models/Item';
import { Order } from './models/Order';
import { Profile } from './models/Profile'


/**
 * Our "Database". In the real world, we'd be using something like MongoDB or PostgreSQL, 
 * and use an ORM like Typeorm to manage the relationship, but this tutorial's primary goal 
 * is to get you familar with how requests and servers work at a high level
 * 
 * We would have a DAO / Repo to manage this normally, but that would be a bit overkill for this app
 */
/* delete item */
export const deleteItem = async (conn: Connection, uuid: string) => {

  const item = await conn.manager.findOne(Item, { uuid });

  if (item == undefined) {
    return "no";
  }
  else {
    await conn.manager.delete(Item, { uuid });
    return "yes";
  }

}

/* create item */
export const createItem = async (conn: Connection, name: string, price: number, description: string) => {
  const item = new Item();
  item.name = name;
  item.description = description;
  item.price = price;

  await conn.manager.save(item);
  return item;
};


/* get list of users */
export const getUsers = async (conn: Connection) => {
  const userList = await conn.manager.find(Profile);
  const list = new Array<Object>();
  for (let i = 0 ;i < userList.length; i++){
      const user = {
        uuid: userList[i].uuid,
        name: userList[i].username
      }
      list.push(user);
  }
  return list;
}

/* get list of items */
export const getItems = async (conn: Connection) => {
  const items = await conn.manager.find(Item);
  return items;
}

/* create profile */
export const createProfile = async (conn: Connection, name: string, password: string) => {
  const found = await conn.manager.findOne(Profile, { username: name });

  if (found != undefined) {
    return "Username already in use";
  }

  const profile = new Profile();
  profile.username = name;
  profile.password = password;

  await conn.manager.save(profile);

  return profile;
}

/* find profile */
export const findProfile = async (conn: Connection, name: string, password: string) => {
  const profile = await conn.manager.findOne(Profile, { username: name });

  if (profile == undefined) {
    return "User hasn't been created"
  }
  else {
    if (profile.password != password) {
      return "Password is wrong";
    }
    return profile;
  }
}

/* create order */
export const createOrder = async (conn: Connection, itemId: string, userId: string) => {
  const ordered = await conn.manager.findOne(Order, {itemId});
  const usered = await conn.manager.findOne(Order, {userId});

  if (ordered != undefined && usered != undefined){
    return "User already ordered item"
  }

  const item = await conn.manager.findOne(Item, { uuid: itemId });
  if (item == undefined) {
    return "Item not found";
  }
  const user = await conn.manager.findOne(Profile, { uuid: userId });
  if (user == undefined) {
    return "User not found";
  }
  const order = new Order();
  order.createdAt = new Date().toLocaleString();
  order.itemId = itemId;
  order.userId = userId;
  order.item = item;

  if (item.orders == undefined){
    item.orders = new Array<Order>();
  }
  item.orders.push(order);

  await conn.manager.save(order);
  const response = {
    uuid: order.uuid,
    createdAt: order.createdAt
  }
  return response;
}

/* get info of user */
export const getUserInfo = async (conn: Connection, userId : string) => {
  const user = await conn.manager.findOne(Profile, {uuid: userId});

  if (user == undefined) {
    return "User not found";
  }
  const ordersInfo = new Array<Object>();

  const orderList = await conn.manager.find(Order, {userId});
  
  const response = {
    uuid: user.uuid,
    name: user.username,
    orders: []
  }
  const responseOrder = new Array<Object>();
  if (orderList.length > 0){
    for (let i = 0 ;i < orderList.length; i++){
      const itemInfo = await conn.manager.findOne(Item, {uuid: orderList[i].itemId});

      const orders = {
        uuid: orderList[i].uuid,
        item: itemInfo.name,
        price: itemInfo.price,
        createdAt: orderList[i].createdAt
      }
      responseOrder.push(orders);
    }
    response.orders = responseOrder; 
  }
  return response;

}

/* get order of user */
export const getOrder = async (conn: Connection, userId : string) => {
  const user = await conn.manager.findOne(Profile, {uuid: userId});

  if (user == undefined){
    return "User not found";
  }

  const orders = await conn.manager.find(Order, {userId});
  const filteredOrders = new Array<Object>();
  
  await Promise.all(orders.map(async (order) => {
    
    const itemObject = await conn.manager.findOne(Item, {uuid: order.itemId});
    
    const item = {
      name: itemObject.name,
      price: itemObject.price
    }
    const filteredItem = {
      uuid: order.uuid,
      createdAt: order.createdAt,
      item: item
    }
    filteredOrders.push(filteredItem);

  }))
  
  
  return filteredOrders;
}

export const getOrderUuid = async (conn: Connection, uuid: string) => {
  const order = await conn.manager.findOne(Order, {uuid});
  const item = await conn.manager.findOne(Item, {uuid: order.itemId});
  const itemObject = {
    name: item.name,
    price: item.price 
  }
  const info = {
    uuid: order.userId,
    createdAt: order.createdAt,
    item: itemObject
  }
  return info;
}

