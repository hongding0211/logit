import * as Router from 'koa-router'
import { IGetApiLogs, IGetApiSystems, IPostApiLog } from './services/types'
import Response from './services/response'
import DataBase from './services/database'
import {SECRET} from "../config";
const shajs = require('sha.js')

const router = new Router()

router.post('/api/log', async (ctx) => {
  const res = new Response<IPostApiLog>()
  try {
    const {token} = ctx.query
    if (token == null) {
      res.throw('Token is required')
      ctx.status = 401
      return
    }
    const t1 = shajs('sha256')
      .update(`${Math.floor(Date.now() / 600000)}${SECRET}`)
      .digest('hex')
    const t2 = shajs('sha256')
      .update(`${Math.floor(Date.now() / 600000 - 1)}${SECRET}`)
      .digest('hex')
    if (token !== t1 && token !== t2) {
      res.throw('Invalid token')
      ctx.status = 403
      return
    }
    const { system, content } = <IPostApiLog['IReq']['body']>ctx.request.body
    const db = new DataBase()
    if ((await db.find('systems', { name: system })).length < 1) {
      await db.insert('systems', [
        {
          name: system,
        },
      ])
    }
    await db.insert(system, [
      {
        time: Date.now(),
        content: JSON.stringify(content),
      },
    ])
    res.set({ system, content })
  } catch (e) {
    res.throw(e.message)
  } finally {
    ctx.body = res.get()
  }
})

router.get('/api/logs', async (ctx) => {
  const res = new Response<IGetApiLogs>()
  const { system, page, size } =
    ctx.query as unknown as IGetApiLogs['IReq']['params']
  try {
    const db = new DataBase()
    const [r, cnt] = await db.findWithPagination(system, +page, +size)
    res.set({
      page: +page,
      size: +size,
      total: cnt,
      content: r,
    })
  } catch (e) {
    res.throw(e.message)
  } finally {
    ctx.body = res.get()
  }
})

router.get('/api/systems', async (ctx) => {
  const res = new Response<IGetApiSystems>()
  try {
    const db = new DataBase()
    const r = await db.find('systems', {}, {})
    res.set({
      systems: r.map((e) => e.name || ''),
    })
  } catch (e) {
    res.throw(e.message)
  } finally {
    ctx.body = res.get()
  }
})

export default router.routes()
