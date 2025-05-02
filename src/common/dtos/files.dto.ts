import { FileType } from '@prisma/client';

export interface CreateFileDto {
  name: string;
  extension: string;
  mimeType: string;
  type: FileType;
  size: number;
  userId: string;
}

export interface UpdateFileDto extends Partial<CreateFileDto> {
  private?: boolean;
}
