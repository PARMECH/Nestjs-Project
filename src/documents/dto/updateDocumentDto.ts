export class UpdateDocumentDto {
    status?: 'pending' | 'processing' | 'complete' | 'failed';
    errorMessage?: string;
  }