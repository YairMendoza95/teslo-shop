import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product, ProductImage } from './entities';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

	private readonly logger = new Logger('ProductsService');

	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,

		@InjectRepository(ProductImage)
		private readonly productImageRepository: Repository<ProductImage>,

		private readonly ds: DataSource
	) { }

	async create(createProductDto: CreateProductDto) {
		try {
			const { images = [], ...productDetails } = createProductDto;
			const product = this.productRepository.create({
				...productDetails,
				images: images.map(image => this.productImageRepository.create({ url: image }))
			}); // Solo instancia el producto

			await this.productRepository.save(product); // Guarda en la BD

			return product;
		} catch (error) {
			this.handleDBException(error);
		}
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit = 10, offset = 0 } = paginationDto;
		const products = await this.productRepository.find({
			take: limit,
			skip: offset,
			relations: {
				images: true
			}
		});

		return products.map(product => ({
			...product,
			images: product.images.map(image => image.url)
		}));
	}

	async findOne(term: string) {
		let product: Product;
		if (isUUID(term)) {
			product = await this.productRepository.findOneBy({ id: term });
		} else {
			const queryBuilder = this.productRepository.createQueryBuilder('p');
			product = await queryBuilder
				.where(`title=:title or slug=:slug`, {
					title: term.toUpperCase(),
					slug: term.toLowerCase()
				})
				.leftJoinAndSelect('p.iamges', 'prodImages')
				.getOne();
		}

		if (!product)
			throw new NotFoundException(`Product not found with term ${term}`);

		return product;
	}

	async findOnePlain(term: string) {
		const { images = [], ...rest } = await this.findOne(term);

		return {
			...rest,
			images: images.map(image => image.url)
		}
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		const { images, ...rest } = updateProductDto;
		const product = await this.productRepository.preload({
			id,
			...rest
		});

		if (!product) {
			throw new NotFoundException(`Product not found with id: ${id}`);
		}


		// Create Query runner, crea una transacción, de tal manera que si se no ejecuta cualquiera de las transacciones a la BD, se hace un rollback
		const queryRunner = this.ds.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();


		try {
			if (images) {
				await queryRunner.manager.delete(ProductImage, { product: { id } });
				product.images = images.map(image => this.productImageRepository.create({ url: image }));
			} else {

			}

			await queryRunner.manager.save(product);
			await queryRunner.commitTransaction();
			await queryRunner.release();

			//await this.productRespository.save(product);
			return this.findOnePlain(id);
		} catch (error) {
			await queryRunner.rollbackTransaction();
			this.handleDBException(error);
		}
	}

	async remove(id: string) {
		const product = await this.findOne(id);
		await this.productRepository.remove(product);
	}

	private handleDBException(error: any) {
		if (error.code === '23505')
			throw new BadRequestException(error.detail);

		throw new InternalServerErrorException('Unexpected error');
	}

	async deleteAllProducts() {
		const query = await this.productRepository.createQueryBuilder('product');

		try {
			return await query
				.delete()
				.where({})
				.execute();
		} catch (error) {
			this.handleDBException(error);
		}
	}
}
