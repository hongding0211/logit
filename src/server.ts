import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import cors = require('koa-cors')
import router from './router'
import {SSO_HOST} from "../config"
import fetch from 'node-fetch'


const app = new Koa()

app.use(cors())

app.use(async (ctx, next) => {
  ctx.set('Content-Type', 'application/json')

  if (ctx.path !== '/api/log') {
    // 去 SSO 鉴权
    const { authToken } = ctx.query
    if (authToken == null) {
      ctx.throw(401, 'Auth token is required')
    }
    const r = await fetch(`${SSO_HOST}/api/checkAuthToken?authToken=${authToken}`, {
      method: 'HEAD',
    })
    if (r.status !== 200) {
      ctx.throw(403, 'Invalid token')
    }
    await next()
  }

  await next()
})

app.use(bodyParser())

app.use(router)

app.listen(4000)
