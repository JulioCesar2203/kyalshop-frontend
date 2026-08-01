import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compartir } from './compartir';

describe('Compartir', () => {
  let component: Compartir;
  let fixture: ComponentFixture<Compartir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compartir]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Compartir);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
