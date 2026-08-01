import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPublicos } from './datos-publicos';

describe('DatosPublicos', () => {
  let component: DatosPublicos;
  let fixture: ComponentFixture<DatosPublicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosPublicos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosPublicos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
