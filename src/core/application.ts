import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { SKIP_AUTH_KEY } from '../decorators';
import {
  CONTROLLER_KEY,
  ROUTES_KEY,
  RouteDefinition,
  extractParameters,
} from '../decorators/controller.decorator';
import { MODULE_KEY, ModuleOptions } from '../decorators/module.decorator';
import { authGuard } from '../modules/middleware/auth.guard';
import { SwaggerGenerator } from '../shared/common/swagger/swagger.generator';
import { AppException } from '../shared/exceptions';
import { AppExceptionFilter } from '../shared/filters/http-exception/app-http-exception.filter';
import { HttpResponseInterceptor } from './http/response.interceptor';

export class ExpressApplication {
  private app: Express;
  private controllers: any[] = [];

  constructor() {
    this.app = express();
    this.setupMiddlewares();
  }

  private setupMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(morgan('combined'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(HttpResponseInterceptor.intercept());
  }

  async bootstrap(AppModule: any, dataSource?: DataSource): Promise<void> {
    if (dataSource) {
      await dataSource.initialize();
      console.log('Database connected successfully');

      // Register DataSource in container
      container.registerInstance(DataSource, dataSource);
    }

    this.loadModule(AppModule);
    this.addDebugEndpoints(); // Adicione este endpoint de debug temporário
    this.setupSwagger(); // Chama o swagger primeiro
    this.setupErrorHandling(); // Depois o error handling
  }

  private addDebugEndpoints(): void {
    // Endpoint para listar todas as rotas registradas
    this.app.get('/debug/routes', (req, res) => {
      const routes: any[] = [];

      this.app._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
          routes.push({
            path: middleware.route.path,
            methods: Object.keys(middleware.route.methods),
            stack: middleware.route.stack.length,
          });
        } else if (middleware.name === 'router') {
          middleware.handle.stack?.forEach((handler: any) => {
            if (handler.route) {
              routes.push({
                path: handler.route.path,
                methods: Object.keys(handler.route.methods),
                stack: handler.route.stack.length,
              });
            }
          });
        }
      });

      res.json({
        message: 'Registered routes',
        routes: routes.sort((a, b) => a.path.localeCompare(b.path)),
        totalRoutes: routes.length,
      });
    });

    console.log('🔍 Debug endpoint available at: /debug/routes');
  }

  private loadModule(ModuleClass: any) {
    const moduleMetadata: ModuleOptions = Reflect.getMetadata(MODULE_KEY, ModuleClass);

    if (!moduleMetadata) {
      throw new AppException(`${ModuleClass.name} is not a valid module`);
    }

    // Load imported modules first and collect their exports
    const availableProviders = new Set<any>();

    if (moduleMetadata.imports) {
      moduleMetadata.imports.forEach((importedModule) => {
        const importedExports = this.loadModule(importedModule);
        // Add exported providers to available providers
        importedExports.forEach((provider) => availableProviders.add(provider));
      });
    }

    // Register providers (only for this module)
    const moduleProviders = new Set<any>();
    if (moduleMetadata.providers) {
      moduleMetadata.providers.forEach((provider) => {
        container.registerSingleton(provider);
        moduleProviders.add(provider);
      });
    }

    // Validate that all dependencies are available
    if (moduleMetadata.providers) {
      moduleMetadata.providers.forEach((provider) => {
        this.validateProviderDependencies(provider, availableProviders, moduleProviders);
      });
    }

    // Register controllers
    if (moduleMetadata.controllers) {
      moduleMetadata.controllers.forEach((controller) => {
        // Validate controller dependencies
        this.validateProviderDependencies(controller, availableProviders, moduleProviders);

        container.registerSingleton(controller);
        this.controllers.push(controller);
        this.registerController(controller);
      });
    }

    // Return exports for parent modules
    const exports = new Set<any>();
    if (moduleMetadata.exports) {
      moduleMetadata.exports.forEach((exportedProvider) => {
        if (moduleProviders.has(exportedProvider)) {
          exports.add(exportedProvider);
        } else {
          throw new AppException(
            `Cannot export ${exportedProvider.name} from ${ModuleClass.name} because it's not a provider of this module`,
          );
        }
      });
    }

    return exports;
  }

  private validateProviderDependencies(
    providerClass: any,
    availableProviders: Set<any>,
    moduleProviders: Set<any>,
  ): void {
    // Get constructor parameters (dependencies)
    const dependencies = Reflect.getMetadata('design:paramtypes', providerClass) || [];

    dependencies.forEach((dependency: any, index: number) => {
      // Skip primitive types
      if (!dependency || typeof dependency !== 'function') {
        return;
      }

      // Check if dependency is available in current module or imported
      if (!moduleProviders.has(dependency) && !availableProviders.has(dependency)) {
        throw new AppException(
          `${providerClass.name} has unresolved dependency at index ${index}. ` +
            `Make sure ${dependency.name} is available in ${providerClass.name}'s module or imported from another module.`,
        );
      }
    });
  }

  private setupSwagger(): void {
    const swaggerSpec = SwaggerGenerator.generateSpec(this.controllers);

    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: process.env.APP_NAME || 'Express API Documentation',
      }),
    );

    // Endpoint para obter a spec em JSON
    this.app.get('/api-docs.json', (req, res) => {
      res.json(swaggerSpec);
    });

    console.log('📚 Swagger documentation available at: /api-docs');
  }

  private registerController(ControllerClass: any): void {
    const controllerPrefix = Reflect.getMetadata(CONTROLLER_KEY, ControllerClass);
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_KEY, ControllerClass) || [];

    const controllerInstance = container.resolve(ControllerClass) as any;

    // Padronizar o prefixo do controller
    const normalizedPrefix = this.normalizePath(controllerPrefix || '');

    // Ordenar rotas: rotas mais específicas primeiro
    // const sortedRoutes = routes.sort((a, b) => {
    //   // ...existing sorting logic...
    // });

    routes.forEach((route) => {
      // Padronizar o path da rota
      const normalizedRoutePath = this.normalizePath(route.path);

      // Construir o path completo
      const fullPath = this.buildFullPath(normalizedPrefix, normalizedRoutePath);

      console.log(`Registering: ${route.requestMethod.toUpperCase()} ${fullPath}`);

      // Verificar se esta rota deve pular a autenticação
      const skipAuth = Reflect.getMetadata(SKIP_AUTH_KEY, controllerInstance, route.methodName);

      // Middleware array - sempre começa vazio
      const middlewares = [];

      // Se não tiver skipAuth, adiciona o authGuard
      if (!skipAuth) {
        middlewares.push(authGuard());
      }

      // Registrar a rota com os middlewares apropriados
      this.app[route.requestMethod](
        fullPath,
        ...middlewares,
        async (req: Request, res: Response, next) => {
          console.log(`Route hit: ${req.method} ${req.path}`);
          try {
            const args = extractParameters(controllerInstance, route.methodName, req, res);

            const result = await controllerInstance[route.methodName](...args);
            if (result !== undefined && !res.headersSent) {
              res.json(result);
            }
          } catch (error) {
            console.error('Error in route handler:', error);
            next(error);
          }
        },
      );

      console.log(
        `✅ Registered route: ${route.requestMethod.toUpperCase()} ${fullPath} ${skipAuth ? '(Public)' : '(Protected)'}`,
      );
    });
  }

  // Métodos auxiliares para normalizar paths
  private normalizePath(path: string): string {
    if (!path) return '';

    // Remove barras duplas e garante que comece com /
    let normalized = path.replace(/\/+/g, '/');

    if (!normalized.startsWith('/')) {
      normalized = `/${normalized}`;
    }

    // Remove barra final se não for apenas '/'
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  }

  private buildFullPath(prefix: string, routePath: string): string {
    if (!routePath || routePath === '/') {
      return prefix || '/';
    }

    if (!prefix || prefix === '/') {
      return routePath;
    }

    return prefix + routePath;
  }

  private setupErrorHandling(): void {
    // Middleware de tratamento de AppException
    this.app.use(AppExceptionFilter.catch());

    // Middleware para rotas não encontradas
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        code: 404,
        error: {
          title: 'Not Found',
          message: 'Route not found',
        },
      });
    });
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
