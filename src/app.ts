import Express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import "reflect-metadata" // required for typeorm
import { createConnection } from "typeorm";
import { Item } from './models/Item';
import { router } from './controller';

import cors from 'cors'

const app = Express();
const port = process.env.PORT || 4000;

app.use(cors())

app.use(bodyParser.json()); // regular json payloads
app.use(bodyParser.urlencoded({ extended: true })); // html form payloads


const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    host: "localhost",
    port: 5432,
    username: "test",
    password: "password",
    database: "testdb",
    entities: [
      Item
    ],
    synchronize: true,
    logging: false
  });

  // ensure every request has a db connection
  app.use((req, _res, next) => {
    req.dbConnection = conn;
    return next();
  });
  app.use(router);
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

main();
