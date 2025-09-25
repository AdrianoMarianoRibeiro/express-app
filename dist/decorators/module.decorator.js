"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_KEY = void 0;
exports.Module = Module;
exports.MODULE_KEY = Symbol("module");
function Module(options) {
    return function (target) {
        Reflect.defineMetadata(exports.MODULE_KEY, options, target);
    };
}
