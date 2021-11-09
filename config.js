const baseUrl = 'https://graphql-listen.datocms.com';
// const baseUrl = 'http://localhost:4001';

const query = `
  query HomePage($limit: IntType) {
    posts: allPosts(first: $limit, orderBy: _firstPublishedAt_DESC) {
      id
      content
      _firstPublishedAt
      photos {
        responsiveImage(imgixParams: {auto: [format]}) {
          ...imageFields
        }
      }
      author {
        name
        avatar {
          responsiveImage(imgixParams: {auto: [format], w: 60}) {
            ...imageFields
          }
        }
      }
    }
  }
  fragment imageFields on ResponsiveImage {
    aspectRatio
    base64
    height
    sizes
    src
    srcSet
    width
    alt
    title
  }
`;
const variables = { limit: 20 };
const token = '73594ec74429bc333ed6ab1fcbc02e';

export { baseUrl, query, variables, token };
