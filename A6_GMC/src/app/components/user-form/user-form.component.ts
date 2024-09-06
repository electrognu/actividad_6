import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Iuser } from '../../interfaces/iuser.interface';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  // dependency injection
  userService = inject(UsersService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  tipoFormulario: string = 'Insertar';
  userForm: FormGroup;


  /// falta los validadores
  constructor() {
    this.userForm = new FormGroup({
      first_name: new FormControl(null, []),
      last_name: new FormControl(null, []),
      email: new FormControl(null, []),
      image: new FormControl(null, [])

    })
  }

  ngOnInit() {
    // Preguntar por parametros de ruta.
    // si no tengo parametros
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.id) {
        this.tipoFormulario = 'Actualizar';
        ///llamar acargar usuario
        const user: Iuser = await this.userService.getUserById(params.id);
        this.userForm = new FormGroup({
          _id: new FormControl(user._id, []),
          first_name: new FormControl(user.first_name, []),
          last_name: new FormControl(user.last_name, []),
          email: new FormControl(user.email, []),
          image: new FormControl(user.image, [])
        })
      } else {
        this.tipoFormulario = 'Insertar';
      }
    })

  }

  async getDataForm() {

    if (this.userForm.value._id) {  // actualizando usuario
      console.log('Actualizando usuario')
      try {
        const resp: Iuser = await this.userService.update(this.userForm.value);
        if (resp._id) {
          let sar = await Swal.fire({
            title: 'Usuario actualizado con exito',
            text: 'Usuario:' + resp.first_name + ' ' + resp.last_name,
            icon: 'success',
            timer: 3000,
          })
          this.router.navigate(['/home']);
        }
      } catch (error) {
        let sar = await Swal.fire({
          title: 'Ups! Algo no fue bien, contacta el administrador!',
          text: 'error:' + error,
          icon: 'error',
        })
        console.log(error);
      }
      console.log(this.userForm.value._id)
    } else {
      console.log('--> Insertando usuario')
      try {
        const resp: Iuser = await this.userService.insert(this.userForm.value);
        console.log(resp);
        if (resp.id) {
          // recargar la lista de usuarios si nos vamos a la pagina actual
          let sar = await Swal.fire({
            title: 'Usuario insertado con exito',
            text: 'Usuario:' + resp.first_name + ' ' + resp.last_name,
            icon: 'success',
            timer: 3000,
          })
          this.router.navigate(['/home']);
        }
      } catch (error) {
        let sar = await Swal.fire({
          title: 'Ups! Algo no fue bien, contacta el administrador!',
          text: 'error:' + error,
          icon: 'error',
        })
        console.log(error);
      }
    }
  }

}
