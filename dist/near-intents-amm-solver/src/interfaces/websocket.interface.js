"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayEventKind = exports.RelayMethod = void 0;
var RelayMethod;
(function (RelayMethod) {
    RelayMethod["SUBSCRIBE"] = "subscribe";
    RelayMethod["QUOTE_RESPONSE"] = "quote_response";
})(RelayMethod || (exports.RelayMethod = RelayMethod = {}));
var RelayEventKind;
(function (RelayEventKind) {
    RelayEventKind["QUOTE"] = "quote";
    RelayEventKind["QUOTE_STATUS"] = "quote_status";
})(RelayEventKind || (exports.RelayEventKind = RelayEventKind = {}));
