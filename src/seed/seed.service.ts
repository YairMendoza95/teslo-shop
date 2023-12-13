import { Injectable } from '@nestjs/common';
import { initialData } from 'src/products/data/seed-data';
//import { Product } from 'src/products/entities';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SeedService {

	constructor(
		private readonly productsService: ProductsService,
	) {
	}

	async runSeed() {
		await this.insertManyProduct();
		const products = initialData.products;

		const insertPromises = [];
		products.forEach((product) => {
			insertPromises.push(this.productsService.create(product));
		});

		await Promise.all(insertPromises);
		return 'Seed executed successfully';
	}

	private async insertManyProduct() {
		await this.productsService.deleteAllProducts();
		return true;
	}
}
