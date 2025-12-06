"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const big_js_1 = __importDefault(require("big.js"));
const quoter_service_1 = require("../src/services/quoter.service");
const margin = 0.3;
test('getAmountOut should be consistent for back and forth', () => {
    const amountIn = new big_js_1.default(10);
    const reserveIn = new big_js_1.default(10000);
    const reserveOut = new big_js_1.default(100000000);
    const amountOut = (0, quoter_service_1.getAmountOut)(amountIn, reserveIn, reserveOut, margin);
    console.log(`getAmountOut(${amountIn}, ${reserveIn}, ${reserveOut}, ${margin}) -> ${amountOut}`);
    const newReserveOut = reserveOut.sub(amountOut);
    const newReserveIn = reserveIn.add(amountIn);
    const newAmountIn = (0, quoter_service_1.getAmountOut)(new big_js_1.default(amountOut), newReserveOut, newReserveIn, margin);
    console.log(`getAmountOut(${amountOut}, ${newReserveOut}, ${newReserveIn}, ${margin}) -> ${newAmountIn}`);
    expect(Number(newAmountIn)).toBeLessThan(Number(amountIn));
    expect(Number(newAmountIn)).toBeGreaterThanOrEqual(Math.floor(Number(amountIn) / (1 + (2 * margin) / 100)));
});
test('getAmountIn should be consistent for back and forth', () => {
    const amountOut = new big_js_1.default(10);
    const reserveIn = new big_js_1.default(100000000);
    const reserveOut = new big_js_1.default(10000);
    const amountIn = (0, quoter_service_1.getAmountIn)(amountOut, reserveIn, reserveOut, margin);
    console.log(`getAmountIn(${amountOut}, ${reserveIn}, ${reserveOut}, ${margin}) -> ${amountIn}`);
    const newReserveOut = reserveOut.sub(amountOut);
    const newReserveIn = reserveIn.add(amountIn);
    const newAmountOut = (0, quoter_service_1.getAmountIn)(new big_js_1.default(amountIn), newReserveOut, newReserveIn, margin);
    console.log(`getAmountIn(${amountIn}, ${newReserveOut}, ${newReserveIn}, ${margin}) -> ${newAmountOut}`);
    expect(Number(newAmountOut)).toBeGreaterThan(Number(amountOut));
    expect(Number(newAmountOut)).toBeLessThanOrEqual(Math.ceil(Number(amountOut) * (1 + (2 * margin) / 100)));
});
