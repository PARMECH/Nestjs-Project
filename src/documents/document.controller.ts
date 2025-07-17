import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateDocumentDto } from './dto/updateDocumentDto';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new Error('File is required');
    }

    // Save file to uploads folder (ensure folder exists)
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    return this.documentService.create({
      filename: file.originalname,
      uploaderId: req.user.userId,
      status: 'pending',
    });
  }

  @Get()
  getAllDocuments() {
    return this.documentService.findAll();
  }

  @Get(':id')
  getDocumentById(@Param('id') id: string) {
    return this.documentService.findById(+id);
  }

  @Patch(':id')
  async updateDocument(
    @Param('id') id: string,
    @Body() body: UpdateDocumentDto,
  ) {
    return this.documentService.update(+id, body);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string) {
    return this.documentService.delete(+id);
  }
}
