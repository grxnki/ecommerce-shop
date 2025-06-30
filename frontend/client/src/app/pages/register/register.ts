// src/app/pages/register/register.ts --- KORRIGIERTER IMPORT ---

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// HIER IST DIE KORREKTUR: Der Pfad hat kein ".service" am Ende
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Sende Formulardaten ans Backend:', this.registerForm.value);

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Erfolgreich registriert!', response);
          alert('Registrierung erfolgreich! Du kannst dich jetzt einloggen.');
        },
        error: (err) => {
          console.error('Fehler bei der Registrierung:', err);
          alert(`Fehler: ${err.error.message}`);
        }
      });
    }
  }
}
