import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassageiroComponent } from './passageiro.component';

describe('PassageiroComponent', () => {
  let component: PassageiroComponent;
  let fixture: ComponentFixture<PassageiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassageiroComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassageiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
