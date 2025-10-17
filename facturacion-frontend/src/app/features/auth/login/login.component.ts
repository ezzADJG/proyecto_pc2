import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importaciones de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Para usar routerLink
    ReactiveFormsModule, // Módulo para formularios reactivos
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true; // Para el botón de mostrar/ocultar contraseña

  // Inyección de dependencias de la forma moderna
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return; // Si el formulario no es válido, no hacer nada
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login exitoso!', response);
        // Guardar el token en el almacenamiento local
        localStorage.setItem('token', response.token);
        // Redirigir al dashboard (crearemos esta ruta más adelante)
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        // Aquí podrías mostrar una notificación de error al usuario
      }
    });
  }
}