export type IResponseBody<
  T extends Record<string, any> | Record<string, any>[]
> = {
  success: boolean
  msg?: string
  data?: T
}

export type IRequest<
  P extends Record<string, any> | undefined,
  T extends Record<string, any> | undefined
> = {
  params?: P
  body?: T
}

export interface IApi {
  IReq: IRequest<
    Record<string, any> | undefined,
    Record<string, any> | undefined
  >
  IRes: IResponseBody<Record<string, any> | Record<string, any>[]>
}

export interface IPostApiLog extends IApi {
  IReq: IRequest<
    undefined,
    {
      system: string
      content: Record<string, any> | Record<string, any>[]
    }
  >
  IRes: IResponseBody<{
    system: string
    content: Record<string, any> | Record<string, any>[]
  }>
}

export interface IGetApiLogs extends IApi {
  IReq: IRequest<
    {
      system: string
      page: number
      size: number
    },
    {
      time?: {
        from: number
        to: number
      }
    }
  >
  IRes: IResponseBody<{
    page: number
    size: number
    total: number
    content: (Record<string, any> | Record<string, any>[])[]
  }>
}

export interface IGetApiSystems extends IApi {
  IReq: IRequest<undefined, undefined>
  IRes: IResponseBody<{
    systems: string[]
  }>
}
