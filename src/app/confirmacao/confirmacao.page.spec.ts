import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacaoPage } from './confirmacao.page';

describe('ConfirmacaoPage', () => {
  let component: ConfirmacaoPage;
  let fixture: ComponentFixture<ConfirmacaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacaoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
