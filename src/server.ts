import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import cors = require('koa-cors')
import router from './router'

const shajs = require('sha.js')
const { SECRET } = require('../config')

const app = new Koa()

app.use(cors())

app.use(async (ctx, next) => {
  ctx.set('Content-Type', 'application/json')

  // const { token } = ctx.query
  // if (token == null) {
  //   ctx.throw(401, 'Token is required')
  //   return
  // }
  // const t1 = shajs('sha256')
  //   .update(`${Math.floor(Date.now() / 600000)}${SECRET}`)
  //   .digest('hex')
  // const t2 = shajs('sha256')
  //   .update(`${Math.floor(Date.now() / 600000 - 1)}${SECRET}`)
  //   .digest('hex')
  // if (token !== t1 && token !== t2) {
  //   ctx.throw(403, 'Invalid token')
  //   return
  // }

  await next()
})

app.use(bodyParser())

app.use(router)

app.listen(4000)
