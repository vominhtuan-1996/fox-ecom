import { ServiceLocator } from './service_locator';

// Data sources
import {
  ProductRemoteDataSource,
  ProductLocalDataSource,
} from '../data/datasources';

// Repositories
import {
  ProductRepositoryImpl,
  CartRepositoryImpl,
} from '../data/repositories';

// Use cases
import {
  GetProductsUsecase,
  GetProductByIdUsecase,
  AddToCartUsecase,
  RemoveFromCartUsecase,
  ClearCartUsecase,
} from '../domain/usecases';

export function setupDependencies(): void {
  // Data sources
  ServiceLocator.register(
    'ProductRemoteDataSource',
    () => new ProductRemoteDataSource(),
  );

  ServiceLocator.register(
    'ProductLocalDataSource',
    () => new ProductLocalDataSource(),
  );

  // Repositories
  ServiceLocator.register('ProductRepository', () => {
    const remote = ServiceLocator.get<ProductRemoteDataSource>(
      'ProductRemoteDataSource',
    );
    const local = ServiceLocator.get<ProductLocalDataSource>(
      'ProductLocalDataSource',
    );
    return new ProductRepositoryImpl(remote, local);
  });

  ServiceLocator.register('CartRepository', () => {
    return new CartRepositoryImpl();
  });

  // Use cases
  ServiceLocator.register('GetProductsUsecase', () => {
    const repo = ServiceLocator.get('ProductRepository');
    return new GetProductsUsecase(repo);
  });

  ServiceLocator.register('GetProductByIdUsecase', () => {
    const repo = ServiceLocator.get('ProductRepository');
    return new GetProductByIdUsecase(repo);
  });

  ServiceLocator.register('AddToCartUsecase', () => {
    const repo = ServiceLocator.get('CartRepository');
    return new AddToCartUsecase(repo);
  });

  ServiceLocator.register('RemoveFromCartUsecase', () => {
    const repo = ServiceLocator.get('CartRepository');
    return new RemoveFromCartUsecase(repo);
  });

  ServiceLocator.register('ClearCartUsecase', () => {
    const repo = ServiceLocator.get('CartRepository');
    return new ClearCartUsecase(repo);
  });
}
