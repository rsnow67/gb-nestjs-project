import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

const publicPath = './public';

export class HelperFileLoad {
  private _path: string;

  public get path(): string {
    return this._path;
  }

  public set path(filePath) {
    this._path = publicPath + filePath;
  }

  public customFileName(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) {
    const originalName = file.originalname.split('.');
    const fileExtension = originalName.at(-1);

    callback(null, `${uuidv4()}.${fileExtension}`);
  }

  public destinationPath(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    callback(null, this.path);
  }
}
