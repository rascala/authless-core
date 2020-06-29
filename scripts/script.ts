import { Authless } from '../src/index'
import { BotRouter } from '../src/bots/botrouter'
import { IAuthlessCore, IService, IBotRouter } from '../src/types'

// use this service and pass it to authless server
class SampleService implements IService {

    domain = 'https://www.crunchbase.com'
    urls = [
        'http://www.crunchbase.com'
    ]
    botRouter: IBotRouter

    constructor(botRouter) {
        this.botRouter = botRouter
    }

    async isAuthenticated(page) {
        return true
    }

    async authenticate(page) {
        // do authentication here
        return true
    }

    async pageHandler(page) {
        // do scraping here
    }
}

