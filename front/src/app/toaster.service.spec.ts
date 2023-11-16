import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, test } from '@jest/globals';
import { ToasterService } from './toaster.service';

describe('ToasterService', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
