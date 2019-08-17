var query = {
    tag: 'palnet',
    limit: 10
  };

steem.api.getDiscussionsByCreated(query, function(err, result)
{
  console.log(err, result);
});
