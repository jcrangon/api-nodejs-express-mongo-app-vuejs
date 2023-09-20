const api = {
  port: 3000,
  scheme: 'http',
  domain: 'localhost',
  base: 'api/v1',
  postUrl: 'posts',
  authUrl: 'auth',
  userUrl: 'user',
  tokenName: 'myblogtoken'
}

const makeConfig = (conf) => {
  const base = !conf.port ? `${conf.scheme}://${conf.domain}/${conf.base}/` : `${conf.scheme}://${conf.domain}:${conf.port}/${conf.base}/`
  return {
      postBaseUrl: `${base}${conf.postUrl}`,
      userBaseUrl: `${base}${conf.userUrl}`,
      authBaseUrl: `${base}${conf.authUrl}`,
      tokenName: conf.tokenName,
  }
}

const apiConfig = makeConfig(api)
console.log('apiConfig: ', apiConfig)
export default apiConfig