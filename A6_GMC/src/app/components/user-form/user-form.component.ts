import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Iuser } from '../../interfaces/iuser.interface';
import { ActivatedRoute, Router } from '@angular/router';

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
        const response: Iuser = await this.userService.update(this.userForm.value);
        if (response._id) {
          console.log('--> Usuario actualizado con exito', response.first_name)
          alert(`--> Usuario actualizado con exito. Id: ${response._id}`);
          this.router.navigate(['/home']);
        }
      } catch (error) {
        alert(`Error al insertar usuario. ${error}`);
        console.log(error);
      }
      console.log(this.userForm.value._id)
    } else {
      console.log('--> Insertando usuario')
      try {
        const response: Iuser = await this.userService.insert(this.userForm.value);
        console.log(response);
        if (response.id) {
          // recargar la lista de usuarios si nos vamos a la pagina actual
          console.log('--> Usuario insertado con exito', response.id)
          alert(`Usuario insertado con exito. Id: ${response.id}`);
          this.router.navigate(['/home']);
        }
      } catch (error) {
        alert(`Error al insertar usuario. ${error}`);
        console.log(error);
      }
    }
  }

}
