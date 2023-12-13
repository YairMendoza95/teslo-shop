import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
	constructor(
		private readonly filesService: FilesService,
		private readonly configService: ConfigService
	) { }

	@Get('product/:imageName')
	findImage(
		@Res() res: Response,
		@Param('imageName') imageName: string
	) {
		const path = this.filesService.getStaticImage(imageName);
		res.sendFile(path);
	}


	@Post('product-image')
	@UseInterceptors(FileInterceptor('file', {
		fileFilter: fileFilter,
		storage: diskStorage({
			destination: './static/products',
			filename: fileNamer
		})
	}))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		if (!file) throw new BadRequestException('File not found. You need to add a file');

		const secureUrl = `${this.configService.get('HOST')}/files/product/${file.filename}`;
		return { secureUrl };
	}
}
