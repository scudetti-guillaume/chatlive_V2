import { TestBed } from '@angular/core/testing';

import { UploadSocketService } from './upload-socket.service';

describe('UploadSocketService', () => {
  let service: UploadSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
