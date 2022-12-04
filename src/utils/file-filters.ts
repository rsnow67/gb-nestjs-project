import { HttpException, HttpStatus } from '@nestjs/common';
import mime = require('mime');

const imageFileFilter = (
  req: any,
  file: any,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  const ext = mime.getExtension(file.mimetype);

  if (ext.match(/(jpe?g|png|gif)$/)) {
    callback(null, true);
  } else {
    callback(
      new HttpException(`Unsupported file type ${ext}`, HttpStatus.BAD_REQUEST),
      false,
    );
  }
};

export default imageFileFilter;
