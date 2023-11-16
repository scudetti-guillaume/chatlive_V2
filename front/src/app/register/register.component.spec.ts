import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, test } from '@jest/globals';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
