interface IAuthlessCore {
  name: string
  bots: IBot[]
  services: IService[]
}

interface IBotRouter {
  bots: IBot[]
  botIndex: number
  getBot(): IBot | undefined
  getBotByUsername(username: string): IBot | undefined
}

interface IBot {
  username: string
  password: string
  hitCount: number
  loginCount: number
  captchaCount: number
  foundLogin: (found: Boolean) => void
  foundCaptcha: (found: Boolean) => void
  getHitCount: () => number
  getLoginHitCount: () => number
  getCaptchaHitCount: () => number
}

// interface IBotRouter {
//     bots: IBot[]
// }

interface IResponse {
  meta: any
  page: any
  content: any
}

interface IServiceRouter {
  services: IService[]
  getServiceFromUrl: (url: string) => IService
}

interface IService {
  domain: string
  urls: string[]
  botRouter: IBotRouter
  isAuthenticated: (page: any) => Promise<Boolean>
  authenticate: (page: any) => Promise<Boolean | string>
  pageHandler: (page: any, params: any) => Promise<void>
}

interface IServer {
  puppeteerParams: any
  proxyParams: any
  prePagePlugs?: (page: any) => void
  resourceTypes: string[]
  authless: IAuthlessCore
  fetch: (url: string, responseType: string, params: any) => IResponse
}

export {
  IBot,
  IService,
  IResponse,
  IBotRouter,
  IAuthlessCore,
  IServiceRouter,
}
