import { Router, Request, Response } from "express";
import path from "path";
import { createItem, deleteItem} from "./service";

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
router.post('/item', async (req: Request, res: Response) => {
  if (!('name' in req.body) || !('price' in req.body)) {
    res.status(400).send('Missing required variables!');
  }
  const name = req.body.name as string;
  const price = Number(req.body.price);
  if (name.length < 0 || name.length > 26 || isNaN(price)) {
    return res.status(400).send('Invalid argument shape!');
  }
  const uuid = await createItem(req.dbConnection, name, price);
  return res.send({
    uuid
  });
});


router.post('/deleteItem', (req, res) => {
  const name = req.body.name as string;
  const status = deleteItem(name);
  return res.send({status});
})
