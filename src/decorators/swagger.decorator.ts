import 'reflect-metadata';

export const SWAGGER_API_OPERATION = Symbol('swagger:api-operation');
export const SWAGGER_API_RESPONSE = Symbol('swagger:api-response');
export const SWAGGER_API_PARAM = Symbol('swagger:api-param');
export const SWAGGER_API_BODY = Symbol('swagger:api-body');
export const SWAGGER_API_QUERY = Symbol('swagger:api-query');
export const SWAGGER_API_TAGS = Symbol('swagger:api-tags');
export const SWAGGER_API_PROPERTY = Symbol('swagger:api-property');

export interface ApiOperationOptions {
  summary?: string;
  description?: string;
  operationId?: string;
}

export interface ApiResponseOptions {
  status: number;
  description: string;
  type?: any;
  isArray?: boolean;
}

export interface ApiParamOptions {
  name: string;
  description?: string;
  type?: 'string' | 'number' | 'boolean';
  required?: boolean;
}

export interface ApiBodyOptions {
  description?: string;
  type?: any;
  required?: boolean;
}

export interface ApiQueryOptions {
  name: string;
  description?: string;
  type?: 'string' | 'number' | 'boolean';
  required?: boolean;
}

export interface ApiPropertyOptions {
  description?: string;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | (() => any) | any;
  format?: string;
  example?: any;
  required?: boolean;
  enum?: any[] | Record<string, any> | any;
  items?: any;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  default?: any;
  isArray?: boolean;
}

// Tipo específico para decorators de método - corrigido
type MethodDecorator<T = any> = (
  target: T,
  propertyKey: string | symbol,
  descriptor?: PropertyDescriptor,
) => void | PropertyDescriptor;

// Tipo específico para decorators de classe
type ClassDecorator<T = any> = (target: new (...args: any[]) => T) => void;

// Tipo específico para decorators de propriedade
type PropertyDecorator = (target: any, propertyKey: string | symbol) => void;

export function ApiOperation(options: ApiOperationOptions): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
    // Usar o descriptor se necessário para validações ou modificações
    if (descriptor && typeof descriptor.value === 'function') {
      // Você pode modificar ou validar a função aqui se necessário
      const originalMethod = descriptor.value;

      // Exemplo: adicionar validação ou log
      descriptor.value = function (...args: any[]) {
        // Log da operação antes da execução (exemplo de uso do descriptor)
        console.log(`Executing API operation: ${options.summary || String(propertyKey)}`);
        return originalMethod.apply(this, args);
      };
    }

    Reflect.defineMetadata(SWAGGER_API_OPERATION, options, target, propertyKey);
    return descriptor;
  };
}

export function ApiResponse(options: ApiResponseOptions): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
    const existingResponses = Reflect.getMetadata(SWAGGER_API_RESPONSE, target, propertyKey) || [];
    existingResponses.push(options);
    Reflect.defineMetadata(SWAGGER_API_RESPONSE, existingResponses, target, propertyKey);
    return descriptor;
  };
}

export function ApiParam(options: ApiParamOptions): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
    const existingParams = Reflect.getMetadata(SWAGGER_API_PARAM, target, propertyKey) || [];
    existingParams.push(options);
    Reflect.defineMetadata(SWAGGER_API_PARAM, existingParams, target, propertyKey);
    return descriptor;
  };
}

export function ApiBody(options: ApiBodyOptions): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
    Reflect.defineMetadata(SWAGGER_API_BODY, options, target, propertyKey);
    return descriptor;
  };
}

export function ApiQuery(options: ApiQueryOptions): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
    const existingQueries = Reflect.getMetadata(SWAGGER_API_QUERY, target, propertyKey) || [];
    existingQueries.push(options);
    Reflect.defineMetadata(SWAGGER_API_QUERY, existingQueries, target, propertyKey);
    return descriptor;
  };
}

export function ApiTags(...tags: string[]): ClassDecorator {
  return function (target: new (...args: any[]) => any) {
    Reflect.defineMetadata(SWAGGER_API_TAGS, tags, target);
  };
}

export function ApiProperty(options: ApiPropertyOptions = {}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const existingProperties = Reflect.getMetadata(SWAGGER_API_PROPERTY, target.constructor) || {};
    existingProperties[propertyKey] = options;
    Reflect.defineMetadata(SWAGGER_API_PROPERTY, existingProperties, target.constructor);
  };
}
