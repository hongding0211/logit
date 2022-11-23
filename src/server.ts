import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import cors = require('koa-cors')
import router from './router'

const app = new Koa()

app.use(cors())

app.use(async (ctx) => {
  ctx.set('Content-Type', 'application/json')
})

app.use(bodyParser())

app.use(router)

app.listen(4000)
