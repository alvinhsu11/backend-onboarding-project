/**
 * This file contains typings so we can put the connection object inside the request response.
 * 
 * Ask us questions if *any* file doesn't make sense!!
 */
import { Connection } from "typeorm";

declare global {
  namespace Express {
    export interface Request {
      dbConnection?: Connection
    }
  }
}