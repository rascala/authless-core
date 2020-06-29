import { IService, IBot, IBotRouter } from '../types'

export class AuthlessService implements IService {
    domain: string
    botRouter: IBotRouter
    urls: string[]
  
    constructor (domain, botRouter, urls) {
      this.domain = domain
      this.botRouter = botRouter
      this.urls = urls
    }
  
    async isAuthenticated(page: any) {
      return true
    }
  
    async authenticate(page: any) {
      return 'to be implemented'
    }
  
    async pageHandler(page: any, params: any) {
      // process the page
    }
}
