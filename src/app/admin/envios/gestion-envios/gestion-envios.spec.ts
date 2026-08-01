import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEnvios } from './gestion-envios';

describe('GestionEnvios', () => {
  let component: GestionEnvios;
  let fixture: ComponentFixture<GestionEnvios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEnvios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEnvios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
