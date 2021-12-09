const baseUrl = 'https://graphql-listen-staging.datocms.com';

const query = `
{
  allArticles {
    id
    title
    _status
    _firstPublishedAt
  }

  _allArticlesMeta {
    count
  }
}
`;

const token = 'c0369f3b98aed7da612c03cdd40959';
const variables = {};

const connections = 2;
const loopSleep = 100;

export { baseUrl, connections, loopSleep, query, token, variables};
