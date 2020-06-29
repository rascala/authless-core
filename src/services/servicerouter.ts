import { IService, IServiceRouter } from '../types'

export class ServiceRouter implements IServiceRouter {
    services: IService[]

    constructor(services: IService[]) {
        this.services = services
    }

    // TODO - try to get service whose URL matches and is the longest(most specific)?
    getServiceFromUrl(url: string) {
        const matchedServices = this.services
            .filter(service => 
                service.urls.find(serviceUrl => url.indexOf(serviceUrl) !== undefined)
            )
        if(matchedServices.length > 0) {
            return matchedServices[0]
        } else {
            return undefined
        }
    }
}