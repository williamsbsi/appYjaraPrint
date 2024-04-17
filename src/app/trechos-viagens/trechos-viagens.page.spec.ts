import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrechosViagensPage } from './trechos-viagens.page';

describe('TrechosViagensPage', () => {
  let component: TrechosViagensPage;
  let fixture: ComponentFixture<TrechosViagensPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrechosViagensPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrechosViagensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
