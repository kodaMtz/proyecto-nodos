import { Component, OnInit } from '@angular/core';
import { UsuarioService, Usuario } from '../../servicios/usuario.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css'],
  standalone: false,
})
export class FormularioComponent implements OnInit {
  miNodo = 'Koda';
  nuevoNombre = '';
  usuarios: Usuario[] = [];
  mensaje = '';
  mensajeError = false;
  usuarioEditando: Usuario | null = null;
  nombreEditando = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarUsuarios();
    setInterval(() => this.cargarUsuarios(), 5000);
  }

  insertar() {
    if (!this.nuevoNombre.trim()) return;
    this.usuarioService.insertarUsuario(this.nuevoNombre).subscribe({
      next: (res) => {
        this.mensaje = `✅ Insertado: ${res.nombre} con ID ${res.id}`;
        this.mensajeError = false;
        this.nuevoNombre = '';
        this.cargarUsuarios();
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: () => {
        this.mensaje = '❌ Error al insertar';
        this.mensajeError = true;
      },
    });
  }

  editar(usuario: Usuario) {
    this.usuarioEditando = usuario;
    this.nombreEditando = usuario.nombre;
  }

  cancelarEdicion() {
    this.usuarioEditando = null;
    this.nombreEditando = '';
  }

  guardarEdicion() {
    if (!this.nombreEditando.trim() || !this.usuarioEditando) return;
    this.usuarioService.actualizarUsuario(this.usuarioEditando.id, this.nombreEditando).subscribe({
      next: () => {
        this.mensaje = `✅ Usuario ID ${this.usuarioEditando!.id} actualizado`;
        this.mensajeError = false;
        this.usuarioEditando = null;
        this.nombreEditando = '';
        this.cargarUsuarios();
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: () => {
        this.mensaje = '❌ Error al actualizar';
        this.mensajeError = true;
      },
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.mensaje = `✅ Usuario ID ${id} eliminado`;
        this.mensajeError = false;
        this.cargarUsuarios();
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: () => {
        this.mensaje = '❌ Error al eliminar';
        this.mensajeError = true;
      },
    });
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: () => console.error('Error al cargar'),
    });
  }
}
