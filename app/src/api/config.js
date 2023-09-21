const api = {
  port: 3000,
  scheme: 'http',
  domain: 'localhost',
  base: 'api/v1',
  postUrl: 'posts',
  authUrl: 'auth',
  userUrl: 'user',
  tokenName: 'myblogtoken',
}

const makeConfig = (conf) => {
  const base = !conf.port ? `${conf.scheme}://${conf.domain}/${conf.base}/` : `${conf.scheme}://${conf.domain}:${conf.port}/${conf.base}/`

  const siteBase = !conf.port ? `${conf.scheme}://${conf.domain}` : `${conf.scheme}://${conf.domain}:${conf.port}`

  return {
      postBaseUrl: `${base}${conf.postUrl}`,
      userBaseUrl: `${base}${conf.userUrl}`,
      authBaseUrl: `${base}${conf.authUrl}`,
      tokenName: conf.tokenName,
      baseUrl: `${siteBase}/`,
      imgUrl: `${siteBase}`
  }
}

const apiConfig = makeConfig(api)
console.log('apiConfig: ', apiConfig)
export default apiConfig