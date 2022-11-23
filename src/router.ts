import * as Router from 'koa-router'
import { IGetApiLogs, IGetApiSystems, IPostApiLog } from './services/types'
import Response from './services/response'
import DataBase from './services/database'

const router = new Router()

router.post('/api/log', async (ctx) => {
  const res = new Response<IPostApiLog>()
  try {
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
