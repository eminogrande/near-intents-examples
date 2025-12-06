"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNonReentrant = makeNonReentrant;
function makeNonReentrant(func) {
    let promise = null;
    return function () {
        if (!promise) {
            promise = func().finally(() => {
                promise = null;
            });
        }
        return promise;
    };
}
