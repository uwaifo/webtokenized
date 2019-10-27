import 'dotenv/config'
import 'reflect-metadata';
//import { createConnection } from 'typeorm';
//import { User } from './entity/User';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';
import { createConnection } from 'typeorm';
(async () => {
  const app = express();
  app.get('/', (_req, res) => {
    res.send('Welcome to JWT');
  });
  console.log(process.env.ACCESS_TOKEN_SECRET)

   await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req,res}) => ({req,res})
   });

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('app statrted');
   });
})()
  .catch(error => console.log(error));
