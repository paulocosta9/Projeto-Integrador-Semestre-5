import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ListarRotaComponent } from './listar-rota.component';

describe('ListarRotaComponent', () => {
  let component: ListarRotaComponent;
  let fixture: ComponentFixture<ListarRotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [
      ReactiveFormsModule,
      HttpClientTestingModule,
    ],
      declarations: [ ListarRotaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarRotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
