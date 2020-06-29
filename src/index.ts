import {
  IBot,
  IService,
  IAuthlessCore,
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

  run (): void {
    // run what?
  }
}
