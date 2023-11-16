import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, test } from '@jest/globals';
import { StaticDataService } from '../providers/static-data-services.service';

describe('StaticDataServicesService', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
