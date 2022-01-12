# Backend Onboarding Project

In this project, you'll be implementing the required backend functions to make a merchandise store function. This will be consumed by the completed version of the [Frontend Onboarding Project](https://github.com/acmucsd/frontend-onboarding-project).

If you're looking for the slides for the presentation, check that out [here](https://docs.google.com/presentation/d/11Nw6POU-6kpVx5bcL1GPg-feVjUiNWPdjTVUfKMytW8)

## How to Run

This project uses Node.js with Typescript, and uses the ExpressJS framework + Docker to run the Postgres DB.

```bash
# after cloning
yarn install
# start the database (detached, so you don't have to worry about keeping that process running)
docker-compose up # install docker @ docker.com/get-started
yarn watch # this will run the server and auto recompile/re-run it anytime you make a change
# navigate to localhost:3000 to see the server!
```

## TODOS

### Note

This is a HUGE initial project to do. We're planning 2-3 weeks for each of you to work on this, although it's totally possible to finish this earlier. We **expect** and **want** you to ask us lots of questions! The best developers ask many questions, and understand that there's really no such thing as a *dumb* question.

We've detailed the required routes for the project here. We highly recommend that you use something like [Postman](https://www.postman.com/) to test out your routes (although the final version of the server should work with the provided frontend).

### Setting up your Database

We intentionally hid the ORM abstraction layer from you initially. Please make sure you pull the DB layer by running `git merge origin/orm` before starting the project.

A diagram detailing the database structure can be found [here](https://dbdiagram.io/d/61db423ef8370f0a2ee93059).

- [ ] `GET /items` - returns a list of all the items
  - Response
    - an array of objects of the following shape
      - `uuid`: the uuid of the item
      - `name`: the name of the item
      - `price`: the price of the item
      - `createdAt`: the time the item was created
- [ ] `POST /item` - creates an item
  - Input (Body, in json or form data)
    - `name`: the name of the item
    - `description`: the description of the item
    - `price`: the price of the item
  - Response:
    - `uuid`: the newly created item's uuid
- [ ] `DELETE /items/:uuid` - deletes an item
  - Response:
    - non 200 status code if there was a failure, 200 status code if it suceeded
- [ ] `POST /order` - creates an order
  - Input (Body, in json or form data)
    - `itemId`: the uuid corresponding with the item
    - `userId`: the uuid corresponding with the user who made the order
  - Note: to simplify things, we're going to assume that a call to this request assumes the user is going to buy *one* item at a time
  - Response:
    - `uuid`: the newly created order's uuid
    - `createdAt`: the time the order was made
- [ ] `GET /orders?userId=`: returns all orders for a given user
  - this uses **query** params (express has this functionality built in)
    - Input (query param)
      - `userId`: the user id
    - Output:
      - `uuid`: the newly created order's uuid
      - `createdAt`: the time the order was made
      - `item`:
        - `name`: the item name
        - `price`: the item price
- [ ] `GET /orders/:uuid`: returns the information associated with an item. To simplify things, we're not going to ask you to add any auth (though adding auth would be cool!)
  - Input (Body, in json or form data)
    - `user`: the uuid of the current user
  - Response
      - `uuid`: the newly created order's uuid
      - `createdAt`: the time the order was made
      - `item`:
        - `name`: the item name
        - `price`: the item price
- [ ] `POST /user`: creates a new user
  - Input (Body, in json or form data)
    - `name`: the user's name
    - `password`: the password
- [ ] `POST /login`: 
  - `username`: 
  - `password`: 
  - Response:
    - `uuid`: the uuid of the user (used as an id for other methods)
- [ ] `GET /users`: gets all users (we're not worried about security for the scope of this project)
  - Response:
    - an array of objects of the following shape
      - `uuid`: a user's uuid
      - `name`: a user's name
- [ ] `GET /user/:uuid`: gets information about a user
  - Response:
    - `uuid`: the user's uuid
    - `name`: a user's name
    - `orders`: an array of all the orders associated with a user, each object in this array should have the following shape
      - `uuid`: the order's uuid
      - `item`: the item that was purchased with this order
      - `price`: the price of the item that was purchased
      - `createdAt` the time the order was placed

## Credits

This tutorial was written by [Ronak Shah](https://ronakshah.org). Special thanks to Steven Steiner, Shravan Hariharan, and Matei Gardus for giving feedback and advice.
