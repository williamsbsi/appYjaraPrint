import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagamentoPage } from './forma-pagamento.page';

describe('FormaPagamentoPage', () => {
  let component: FormaPagamentoPage;
  let fixture: ComponentFixture<FormaPagamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaPagamentoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaPagamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
