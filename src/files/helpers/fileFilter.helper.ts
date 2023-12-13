
// eslint-disable-next-line @typescript-eslint/ban-types
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    //console.log({ file });

    if (!file) return callback(new Error('File not found'), false);

    const fileExtension = file.mimetype.split('/')[1];

    const validExtensions = ["png", "gif", "jpg", "jpeg", "svg"];

    if (validExtensions.includes(fileExtension)) {
        return callback(null, true);
    }

    callback(null, false);
}
