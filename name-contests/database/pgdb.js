const humps = require('humps')
const _ = require('lodash')

module.exports = pgPool => {
  const orderedFor = (rows, collection, field, singleObject) => {
    // return rows ordered for the collection
    const data = humps.camelizeKeys(rows)
    const inGroupOfField = _.groupBy(data, field)
    return collection.map(element => {
      const elementArray = inGroupOfField[element]
      if (elementArray) {
        return singleObject ? elementArray[0] : elementArray
      }
      return singleObject ? {} : []
    })
  }

  return {
    getUsersByIds(ids) {
      return pgPool
        .query(
          `
                select * from users
                where id = ANY($1)
            `,
          [ids]
        )
        .then(res => {
          return orderedFor(res.rows, ids, 'id', true)
        })
    },
    getUsersByApiKeys(keys) {
      return pgPool
        .query(
          `
                select * from users
                where api_key = ANY($1)
            `,
          [keys]
        )
        .then(res => {
          return orderedFor(res.rows, keys, 'apiKey', true)
        })
    },
    getContestsForUserIds(userIds) {
      return pgPool
        .query(
          `
                select * from contests
                where created_by = ANY($1)
            `,
          [userIds]
        )
        .then(res => {
          return orderedFor(res.rows, userIds, 'createdBy', false)
        })
    },
    getNamesForContestIds(contestIds) {
      return pgPool
        .query(
          `
                select * from names
                where contest_id = ANY($1)
            `,
          [contestIds]
        )
        .then(res => {
          return orderedFor(res.rows, contestIds, 'contestId', false)
        })
    }
  }
}
