## Examples

### Query

```
query MyContests {
   user(key: "4242") {
     id
     email
     fullName
     contestsCount
     namesCount
     votesCount
     contests {
       title
       names {
         label
         createdBy {
           fullName
         }
         totalVotes {
           up
           down
         }
       }
     }
   }
}
```

### Mutation

```
mutation AddNewContest($input: ContestInput!) {
  AddContest(input: $input) {
    id,
    code,
    title,
    description,
    status
  }
}
```

### Union

```
{
  user(key: "0000") {
    email
    fullName
    activities {
      ... on Contest {
        title
      }
      ... on Name {
        header: label
      }
  	}
  }
}
```
