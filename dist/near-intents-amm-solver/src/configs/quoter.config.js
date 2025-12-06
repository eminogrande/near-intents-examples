"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marginPercent = exports.quoteDeadlineExtraMs = exports.quoteDeadlineMaxMs = void 0;
exports.quoteDeadlineMaxMs = 1 * 60 * 1000; // 1 min
exports.quoteDeadlineExtraMs = 10 * 1000; // 10 seconds (extra time to add to the requested deadline)
exports.marginPercent = process.env.MARGIN_PERCENT ? Number(process.env.MARGIN_PERCENT) : 0.3;
