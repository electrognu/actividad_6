import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  userService = inject(UsersService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  userForm: FormGroup;
  formType: string = 'Insertar';

  /**
   * Constructor. Creates a new FormGroup with the following fields:
   * first_name, last_name, email and image.
   * No validators used here, rewrited in ngOnInit funtion
   */
  constructor() {
    this.userForm = new FormGroup({
      first_name: new FormControl(null, []),
      last_name: new FormControl(null, []),
      email: new FormControl(null, []),
      image: new FormControl(null, [])
    },
      [])
  }

  /**
   * Lifecycle hook that is called when the component is initialized.
   * Checks if the URL contains an id parameter. If so, it sets the formType to 'Actualizar'
   * and using the UserService.getUserById() initializes the form  with the loaded user's data. 
   * If not, it sets the formType to 'Insertar' and the form is set empty.
   */
  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.id) {
        this.formType = 'Actualizar';
        ///llamar acargar usuario
        const user: Iuser = await this.userService.getUserById(params.id);
        this.userForm = new FormGroup({
          _id: new FormControl(user._id, []),
          first_name: new FormControl(user.first_name, [Validators.required, Validators.minLength(3)]),
          last_name: new FormControl(user.last_name, [Validators.required, Validators.minLength(3)]),
          email: new FormControl(user.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
          image: new FormControl(user.image, [Validators.required, Validators.pattern(/^https:\/\/i\.pravatar\.cc\/\d+\?u=[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)])
        }, [])
      } else {
        this.formType = 'Insertar';
        this.userForm = new FormGroup({
          first_name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
          last_name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
          email: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
          image: new FormControl(null, [Validators.required, Validators.pattern(/^https:\/\/i\.pravatar\.cc\/\d+\?u=[a-zA-Z0-9._%+-]/)])
        })
      }
    })

  }

  /**
   * Called when the user submits the form.
   * If the form contains an _id property, it calls the UserService.update() method.
   * If not, it calls the UserService.insert() method.
   * In both cases, it shows a Swal.fire() message with the result of the operation.
   * If the operation was successful, it navigates to the '/home' route.
   */
  async getDataForm() {

    if (this.userForm.value._id) {
      // Actualize user
      try {
        const resp: Iuser = await this.userService.update(this.userForm.value);
        if (resp._id) {
          const sar = await Swal.fire({
            title: 'Usuario actualizado con exito',
            text: 'Usuario:' + resp.first_name + ' ' + resp.last_name,
            icon: 'success',
            timer: 3000,
          })
          this.router.navigate(['/home']);
        }
      } catch (error) {
        const sar = await Swal.fire({
          title: 'Ups! Algo no fue bien, contacta el administrador!',
          text: 'error:' + error,
          icon: 'error',
        })

      }
    } else {
      // Insert user
      try {
        const resp: Iuser = await this.userService.insert(this.userForm.value);
        if (resp.id) {
          const sar = await Swal.fire({
            title: 'Usuario insertado con exito',
            text: 'Usuario:' + resp.first_name + ' ' + resp.last_name,
            icon: 'success',
            timer: 3000,
          })
          this.router.navigate(['/home']);
        }
      } catch (error) {
        const sar = await Swal.fire({
          title: 'Ups! Algo no fue bien, contacta el administrador!',
          text: 'error:' + error,
          icon: 'error',
        })
      }
    }
  }

}
