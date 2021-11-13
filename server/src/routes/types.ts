import { Request, Response } from 'express'

interface Req<body = {}> extends Request {
  body: body
}

export type getUserReq = Req<{ id: string }>
export type getUserRes = Response<{ user: any }>

export type loginWithCookieReq = Req<{}>
export type loginWithCookieRes = Response<{
  user: any
}>
