import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressorasPage } from './impressoras.page';

describe('ImpressorasPage', () => {
  let component: ImpressorasPage;
  let fixture: ComponentFixture<ImpressorasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpressorasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpressorasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
