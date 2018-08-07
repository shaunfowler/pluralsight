const humps = require('humps');
const { orderedFor } = require('../lib/util');
const { slug } = require('../lib/util');

module.exports = pgPool => {
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
          return orderedFor(res.rows, ids, 'id', true);
        });
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
          return orderedFor(res.rows, keys, 'apiKey', true);
        });
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
          return orderedFor(res.rows, userIds, 'createdBy', false);
        });
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
          return orderedFor(res.rows, contestIds, 'contestId', false);
        });
    },
    getTotalVotesByNameIds(nameIds) {
      return pgPool
        .query(
          `select name_id, up, down from total_votes_by_name
           where name_id = ANY($1)
      `,
          [nameIds]
        )
        .then(res => {
          return orderedFor(res.rows, nameIds, 'nameId', true);
        });
    },
    addNewContest({ apiKey, title, description }) {
      return pgPool
        .query(
          `insert into contests(code, title, description, created_by)
           values ($1, $2, $3, 
             (select id from users where api_key = $4))
           returning *
      `,
          [slug(title), title, description, apiKey]
        )
        .then(res => {
          return humps.camelizeKeys(res.rows[0]);
        });
    },
    getActivitiesForUserIds(userIds) {
      return pgPool
        .query(
          `select created_by, created_at, label, '' as title, 'name' as activity_type
           from names
           where created_by = ANY($1)
           union
           select created_by, created_at, '' as label, title, 'contest' as activity_type
           from contests
           where created_by = ANY($1)`,
          [userIds]
        )
        .then(res => {
          return orderedFor(res.rows, userIds, 'createdBy', false);
        });
    }
  };
};
