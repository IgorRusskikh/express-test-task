import {
  deleteFile,
  downloadFile,
  getFile,
  getFiles,
  updateFile,
  uploadFile,
} from '@src/controllers/files/files.controller';
import { updateUpload, upload } from '@src/middleware/multer.middleware';

import { Router } from 'express';

const router = Router();

router.get('/list', getFiles);
router.post('/upload', upload.single('file'), uploadFile);
router.get('/download/:id', downloadFile);
router.delete('/delete/:id', deleteFile);
router.put('/update/:id', updateUpload.single('file'), updateFile);
router.get('/:id', getFile);

export default router;
