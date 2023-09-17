const utils = {
  logRequest: (req) => {
    console.log('Req: ', req.originalUrl )
    console.log('Base url: ', req.baseUrl )
    console.log('Url: ', req.url)
    console.log('Req headers:', req.headers);
    console.log('Req body',req.body)
  }
}

module.exports = utils