import { IBotRouter, IBot } from "../types";

export class BotRouter implements IBotRouter {
    bots: IBot[]
    botIndex = 0

    constructor(bots: IBot[]) {
        this.bots = bots
    }

    private incrementBotIndex() {
        const botIndex = this.botIndex
        this.botIndex = (this.botIndex + 1) % this.bots.length
        return botIndex
    }

    getBot(): IBot | undefined {
        if(this.botIndex >= this.bots.length) {
            return undefined
        } else {
            return this.bots[this.incrementBotIndex()]
        }
    }

    // TODO - get only if bot.isBelowRateLimit() is true
    getBotByUsername(name: string): IBot | undefined {
        return this.bots.find(bot => bot.username === name)
    }
}