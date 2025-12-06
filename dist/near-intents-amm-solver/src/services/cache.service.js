"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
class CacheService {
    constructor() {
        this.cache = new node_cache_1.default({ stdTTL: 0, checkperiod: 0 });
    }
    set(key, value, ttlSeconds) {
        this.cache.set(key, value, ttlSeconds ?? 0);
    }
    mset(entries) {
        this.cache.mset(Object.entries(entries).map(([key, value]) => ({ key, val: value })));
    }
    get(key) {
        return this.cache.get(key);
    }
    del(key) {
        this.cache.del(key);
    }
}
exports.CacheService = CacheService;
