import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, test } from '@jest/globals';
import { ChatFormComponent } from './chat-form.component';

describe('ChatFormComponent', () => {
  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatFormComponent]
    });
    fixture = TestBed.createComponent(ChatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
