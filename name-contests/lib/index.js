const { nodeEnv } = require('./util')

// postgres
const pg = require('pg')
const pgConfig = require('../config/pg')[nodeEnv]
const pgPool = new pg.Pool(pgConfig)

// mongo
const { MongoClient } = require('mongodb')
const assert = require('assert')
const mConfig = require('../config/mongo')[nodeEnv]

// gql & express
const express = require('express')()
const expressGraphql = require('express-graphql')
const ncSchema = require('../schema')

MongoClient.connect(
  mConfig.url,
  (err, mPool) => {
    assert.equal(err, null)

    express.use(
      '/graphql',
      expressGraphql({
        schema: ncSchema,
        graphiql: true,
        context: {
          pgPool,
          mPool
        }
      })
    )

    const PORT = process.env.PORT || 3000
    express.listen(PORT, () => {
      console.log(`Listening on ${PORT}`)
    })
  }
)
