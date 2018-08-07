const DataLoader = require('dataloader');
const { nodeEnv } = require('./util');

// postgres
const pg = require('pg');
const pgConfig = require('../config/pg')[nodeEnv];
const pgPool = new pg.Pool(pgConfig);
const pgdb = require('../database/pgdb')(pgPool);

// mongo
const { MongoClient } = require('mongodb');
const assert = require('assert');
const mConfig = require('../config/mongo')[nodeEnv];

// gql & express
const express = require('express')();
const expressGraphql = require('express-graphql');
const ncSchema = require('../schema');

MongoClient.connect(
  mConfig.url,
  (err, mPool) => {
    assert.equal(err, null);

    const mdb = require('../database/mdb')(mPool);

    express.use('/graphql', (req, res) => {
      const loaders = {
        usersByIds: new DataLoader(pgdb.getUsersByIds),
        usersByApiKey: new DataLoader(pgdb.getUsersByApiKeys),
        namesForContestIds: new DataLoader(pgdb.getNamesForContestIds),
        contestsForUserIds: new DataLoader(pgdb.getContestsForUserIds),
        totalVotesByNameIds: new DataLoader(pgdb.getTotalVotesByNameIds),
        activitiesForUserIds: new DataLoader(pgdb.getActivitiesForUserIds),
        mdb: {
          usersByIds: new DataLoader(mdb.getUsersByIds)
        }
      };
      expressGraphql({
        schema: ncSchema,
        graphiql: true,
        context: {
          pgPool,
          mPool,
          loaders
        }
      })(req, res);
    });

    const PORT = process.env.PORT || 3000;
    express.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  }
);
