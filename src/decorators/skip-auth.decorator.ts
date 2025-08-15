import 'reflect-metadata';

export const SKIP_AUTH_KEY = Symbol('skip:auth');

export function SkipAuth() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(SKIP_AUTH_KEY, true, target, propertyKey);
    return descriptor;
  };
}
