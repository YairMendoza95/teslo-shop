import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({ // Conexión de DB, en el app.module se declara el forRoot
			type: 'postgres',
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			database: process.env.DB_NAME,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			autoLoadEntities: true,
			synchronize: true, // Esta propiedad sirve para sincronizar los cambios de la base de datos, como eliminación de columnas
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public')
		}),
		ProductsModule,
		CommonModule,
		SeedModule,
		FilesModule,
		AuthModule,
	],
})
export class AppModule { }
