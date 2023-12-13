import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';

@Module({
	imports: [TypeOrmModule.forFeature([Product, ProductImage])], // Dentro de los demás modulos se declara un forFeature y no un forRoot
	controllers: [ProductsController],
	providers: [ProductsService],
	exports: [
		ProductsService,
		TypeOrmModule
	] // Para poder acceder a los metodos de otro servicio se necesita exportar primero
})
export class ProductsModule { }
