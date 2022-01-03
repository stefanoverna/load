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

const token = 'd71a27dd2d1ff400ffbc2490ef5e72';
const variables = {};

const connections = 2;
const loopSleep = 100;

export { baseUrl, connections, loopSleep, query, token, variables };
