import { v4 as uuid } from "uuid";
// eslint-disable-next-line @typescript-eslint/ban-types
export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) return callback(new Error('File not found'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const filename = `${uuid()}.${fileExtension}`;

    callback(null, filename);
}
