import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect,it, test } from '@jest/globals';
import { FileUploadService } from './upload-file.service';

describe('UploadFileService', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
