import { Request } from 'express';

export interface IFileRequest extends Request {
  fileInfo?: {
    fullName: string;
    baseName: string;
    extension: string;
  };
}
