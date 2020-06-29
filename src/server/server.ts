/* eslint-disable no-warning-comments */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as path from 'path'
import { IBot, IResponse, IService, IServiceRouter } from '../types'

interface UrlParams {
  url: string
  responseFormat: string
  referrer?: string
  username?: string
}

export class AuthlessServer {
  logger: any
  puppeteerParams: any
  puppeteerPlugins: any[]
  serviceRouter: IServiceRouter
  responses: any[]

  constructor (serviceRouter: IServiceRouter, puppeteerParams: any, puppeteerPlugins: any) {
    this.serviceRouter = serviceRouter
    this.puppeteerParams = puppeteerParams
    this.puppeteerPlugins = puppeteerPlugins
  }

  // TODO - simplify getJsonResponse and makeExpressResponse
  // eslint-disable-next-line max-params
  async getJsonResponse (bot, page, response, responses): Promise<void> {
    console.log('to do')
  }

  // eslint-disable-next-line max-params
  async makeExpressResponse (expressResponse, response, page, bot, urlParams): Promise<void> {
    const responseFormat = urlParams.responseFormat || 'html'
    if (responseFormat === 'json') {
      expressResponse.set('Content-Type', 'application/json; charset=utf-8')
      const jsonResponse = await this.getJsonResponse(bot, page, response, this.responses)
      return expressResponse.status(200).send(jsonResponse)
    } else if (expressResponse.query.responseFormat === 'png') {
      return expressResponse.end(await page.screenshot({fullPage: true}), 'binary')
    }
    expressResponse.set('Content-Type', 'text/html')
  }

  getProfileDirName (serviceName: string, username: string): string {
    return `${serviceName}-${username}`
  }

  // TODO - how do we handle anonymous users(bot is undefined)
  async launchBrowser (service: IService, bot: IBot): Promise<any> {
    const puppeteer: any = {}
    this.puppeteerPlugins.forEach(plugin => {
      puppeteer.use(plugin)
    })

    // calculate data-dir to store Chrome user data
    const dataDirName = this.getProfileDirName(service.domain, bot.username)
    // eslint-disable-next-line init-declarations
    let userDataDir: string | undefined
    if(this.puppeteerParams.userDataDir) {
      userDataDir = this.puppeteerParams.userDataDir
    }
    if (process.env.CHROME_USER_DATA_DIR) {
      userDataDir = path.resolve(
        path.join(process.env.CHROME_USER_DATA_DIR, dataDirName))
    }
    this.logger(`launching browser with userDataDir: ${userDataDir}`)
    const browser = await puppeteer.launch({
      ...this.puppeteerParams,
      userDataDir
    })
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    this.logger(`launched browser: ${await browser.version()}`)
    return browser
  }

  ping (name: string): string {
    return `hello ${name}`
  }

  speedTest (urlParams: any): any {
    // start puppeteer with this.puppeteerParams
    // run speedtest
    return {'speed': '1000'}
  }

  async scrape (expressResponse, urlParams: UrlParams): Promise<IResponse> {
    const { url, responseFormat, referrer, username } = urlParams

    // try to fetch the sevice for this url
    const service = this.serviceRouter.getServiceFromUrl(url)
    if(typeof service === 'undefined') {
      throw new Error('Service not found')
    }

    // get bot when username not provided explicitly
    let bot = service.botRouter.getBot()
    if(typeof bot === 'undefined') {
      throw new Error(`User not found for service ${service.domain}`)
    }
    // get bot when username is provided
    if(typeof username !== 'undefined') {
      bot = service.botRouter.getBotByUsername(username)
      if(typeof bot === 'undefined') {
        throw new Error(`User not found for user ${username}`)
      }
    }

    // initiate the browser
    const browser = await this.launchBrowser(service, bot)
    const page = await browser.newPage()

    if(this.puppeteerParams.viewPort) {
      page.setViewPort(this.puppeteerParams.viewPort)
    }

    // TODO - save only xhr responses?
    const saveResponse = async (response: any): Promise<void> => {
      this.responses.push(await response.json())
    }
    // attach handler to save responses
    page.on('response', saveResponse)

    const response = await page.goto(
      url,
      referrer
    )

    // let service handle the page
    await service.pageHandler(page, urlParams)

    // TODO
    page.off('response', saveResponse)

    await this.makeExpressResponse(expressResponse, response, page, bot, urlParams)
    return expressResponse.status(200).send(await page.content())

    // return {'meta': 'example', 'content': 'some content', 'page': 'page data'}
  }

  run (): void {
    // start express

    // -- call function based on url
    // ping -> this.ping
    // speedtest -> await this.speedtest
    // scrape -> await this.scraper
    // others -> http.404
  }
}
