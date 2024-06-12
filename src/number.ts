import { generatePercentChanceToFlake, log, PERCENT_CHANCE_OF_SUCCESS } from './utils'
const clonedToString = Number.prototype.toString

Number.prototype.toString = function (radix) {
    if(generatePercentChanceToFlake() > PERCENT_CHANCE_OF_SUCCESS) {
        log('Number.prototype.toString flaking')
        const toAdd = (Math.random() < 0.5) ? -1 : 1;
        return clonedToString.apply(+this + toAdd, [radix])
    }
    return clonedToString.apply(this, [radix])
}
// let a = 555
// console.log(a.toString())

// sample of havoc to be caused
// - Number(555).toString() -> "554" or "556"