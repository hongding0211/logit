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
