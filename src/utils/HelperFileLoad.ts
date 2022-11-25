import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

const publicPath = './public';
let path: string = publicPath;

export abstract class HelperFileLoad {
  static set path(_path: string) {
    path = publicPath + _path;
  }

  public static customFileName(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) {
    const originalName = file.originalname.split('.');
    const fileExtension = originalName.at(-1);

    callback(null, `${uuidv4()}.${fileExtension}`);
  }

  public static destinationPath(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    callback(null, path);
  }
}
