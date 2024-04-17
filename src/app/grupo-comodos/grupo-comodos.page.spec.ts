import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoComodosPage } from './grupo-comodos.page';

describe('GrupoComodosPage', () => {
  let component: GrupoComodosPage;
  let fixture: ComponentFixture<GrupoComodosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoComodosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoComodosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
