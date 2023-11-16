import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, test } from '@jest/globals';

import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListComponent]
    });
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
