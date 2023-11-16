import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, test } from '@jest/globals';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
