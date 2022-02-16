import { Router, Request, Response } from "express";
import path from "path";
import { GridFSBucketWriteStream } from "typeorm";
import { createBrotliDecompress } from "zlib";
import { createItem, createProfile, deleteItem , getUsers, 
  findProfile, createOrder, getUserInfo, getOrder, getItems, getOrderUuid} from "./service";

export const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// We're disabling bearer-based authentication for this example since it'll make it tricky to test with pure html
// sending bearer tokens in your requests is *far* easier using frameworks like axios or fetch
// const authorizedUsers = ["ronak"]; // not really how auth works, but this is a simple example
// 
// router.use("/admin", (req, res, next) => {
//   const bearerHeader = req.headers['authorization'];

//   if (bearerHeader) {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     if (authorizedUsers.includes(bearerToken)) {
//       return next();
//     }
//   }
//   return res.status(401).send("Unauthorized");
// });

// handle all POST requests that match '/'

/* Create Item */
router.post('/item', async (req: Request, res: Response) => {
  if (!('name' in req.body) || !('price' in req.body)) {
    res.status(400).send('Missing required variables!');
  }
  const name = req.body.name as string;
  const price = Number(req.body.price);
  const description = req.body.description as string;

  if (name.length <= 0 || name.length > 26 || isNaN(price)) {
    return res.status(400).send('Invalid argument shape!');
  }
  const itemCreated = await createItem(req.dbConnection, name, price, description);
  return res.send(itemCreated);
});

/* Delete Item */
router.delete('/items/:uuid', async (req, res) => {
  const uuid = req.params.uuid as string;
  const deletedItem = await deleteItem(req.dbConnection, uuid);

  if (deletedItem == "yes"){
    res.status(400).send("yes");  
  }
  else return res.status(200).send("no");
})

/* create user */
router.post('/user', async (req: Request, res: Response) => {
  if (!('username' in req.body) || !('password' in req.body)){
    res.status(400).send("Missing required variables!");
  }
  const name = req.body.username as string;
  const password = req.body.password as string;

  if (name.length <= 0 || password.length <= 0 || name.length > 26 || password.length > 26){
    return res.status(400).send("Invalid argument shape!");
  }
  var status = await createProfile(req.dbConnection, name, password);
  return res.send(
    status
  );
});

/* Order item */
router.post('/order', async (req: Request, res: Response) => {
    if (!('itemId' in req.body) || !('userId' in req.body)){
    res.status(400).send("Missing required variables!");
  }
  const itemId = req.body.itemId as string;
  const userId = req.body.userId as string;

  if (itemId.length < 16 || userId.length < 16){
    return res.status(400).send("Invalid argument shape!");
  }
  const order = await createOrder(req.dbConnection, itemId, userId);
  return res.send({order});


});


/* user login */
router.post('/login', async (req: Request, res: Response) => {
  if (!('username' in req.body) || !('password' in req.body)){
    res.status(400).send("Missing required variables!");
  }
  const name = req.body.username as string;
  const password = req.body.password as string;

  if (name.length <= 0 || password.length <= 0 || name.length > 26 || password.length > 26){
    return res.status(400).send("Invalid argument shape!");
  }
  const uuid = await findProfile(req.dbConnection, name, password);
  return res.send(uuid);
});

/* Get list of users */
router.get('/users', async (req,res) => {
  const userList = await getUsers(req.dbConnection);
  return res.send({userList});
});

/* Get list of items */
router.get('/items', async (req, res) => {
  const items = await getItems(req.dbConnection);
  return res.send(items);
})

/* Get info of user */
router.get('/users/:uuid', async (req, res) => {
  if (!('uuid' in req.params)){
    return res.status(400).send("Missing required variables");
  }
  const name = req.params.uuid as string;
  if (name.length < 16){
    return res.status(400).send("Invalid argument shape!");
  }
  const status = await getUserInfo(req.dbConnection, name);
  return res.send(status);
})

/* Get orders of user */
router.get('/orders', async (req, res) => {
  
  const user = req.query.userId as string;


  if (user.length < 16){
    return res.status(400).send("Invalid argument shape!");
  }
  const orders = await getOrder(req.dbConnection, user);
  return res.send(orders);
})

/* Get into about item order */
router.get('/orders/:uuid', async (req, res) => {
  const order = req.body.uuid as string;

  const item = await getOrderUuid(req.dbConnection, order);
  return res.send(item);
})




