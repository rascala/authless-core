import {
  IAuthlessCore,
  IBot,
  IService,
} from './types'

export class Authless implements IAuthlessCore {
  name: string
  bots: IBot[]
  services: IService[]

  constructor (name, bots, services) {
    this.name = name
    this.bots = bots
    this.services = services
  }

  // eslint-disable-next-line class-methods-use-this
  run (): void {
    // run what?
  }
}
