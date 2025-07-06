import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientesService, Ingrediente } from '../../services/ingredientes.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-ingredientes',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: 'ingredientes.component.html'
})
export class IngredientesComponent implements OnInit {
  ingredientes: Ingrediente[] = [];
  form: FormGroup;
  idEditando: number | null = null;
  pesoKg: number | null = null;

  constructor(
    private ingredientesService: IngredientesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      precio: [null, Validators.required],
      unidad: [null],
      peso: [null],
      unidadPeso: ['g'],
    });
  }

  ngOnInit(): void {
    this.cargarIngredientes();
  }

  cargarIngredientes() {
    this.ingredientesService.getIngredientes().subscribe(data => {
      this.ingredientes = data;
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const ingrediente: Ingrediente = {
      nombre: this.form.value.nombre,
      precio: this.form.value.precio,
      unidad: this.form.value.unidad,
      peso: this.form.value.peso,
      unidadPeso: this.form.value.unidadPeso
    };

    this.pesoKg = this.convertirAKg(ingrediente.peso ?? 0, ingrediente.unidadPeso ?? 'g');

const request$ = this.idEditando
  ? this.ingredientesService.updateIngrediente(this.idEditando, ingrediente)
  : this.ingredientesService.addIngrediente(ingrediente);


    request$.subscribe({
      next: () => {
        this.cancelarEdicion();
        this.cargarIngredientes();
      },
      error: (err) => {
        console.error('Error en guardar:', err);
        if (err.error?.message) {
          alert('Error del backend:\n' + JSON.stringify(err.error.message, null, 2));
        }
      }
    });
  }

  editar(ingrediente: Ingrediente) {
    this.idEditando = ingrediente.id!;
    this.form.setValue({
      nombre: ingrediente.nombre,
      precio: ingrediente.precio,
      unidad: ingrediente.unidad,
      peso: ingrediente.peso,
      unidadPeso: ingrediente.unidadPeso ?? 'g'
    });
  }

  cancelarEdicion() {
    this.idEditando = null;
    this.form.reset({
      nombre: '',
      precio: 0,
      unidad: '',
      peso: null,
      unidadPeso: 'g'
    });
  }

  eliminar(id: number) {
    this.ingredientesService.deleteIngrediente(id).subscribe(() => {
      this.ingredientes = this.ingredientes.filter(i => i.id !== id);
    });
  }

  convertirAKg(peso: number, unidad: string): number {
    if (!peso || !unidad) return 0;

    switch (unidad) {
      case 'g':
        return peso / 1000;
      case 'mg':
        return peso / 1_000_000;
      case 'lb':
        return peso * 0.453592;
      case 'oz':
        return peso * 0.0283495;
      default:
        return 0;
    }
  }
}
