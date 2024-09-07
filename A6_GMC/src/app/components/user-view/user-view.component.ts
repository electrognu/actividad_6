import { Component, inject } from '@angular/core';
import { Iuser } from '../../interfaces/iuser.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent {
  user: Iuser | null = null;
  // Vamos a capturar la ruta 
  activatedRoute = inject(ActivatedRoute);
  userService = inject(UsersService);

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      let id = params.id;
      this.user = await this.userService.getUserById(id);
      console.log(this.user)
    })
  }

  async delete(id: string) {

    let sar = await Swal.fire({
      title: 'Seguro que quieres eliminar',
      text: 'el empleado con id :' + id,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    })

    /// console.log(sar);
    if (sar.isConfirmed) {
      //lamo al servicio y hago el borrado.
      try {
        const resp = await this.userService.deleteUserById(id);
        let sar = await Swal.fire({
          title: 'Eliminado con exito',
          text: 'Usuario:' + resp.first_name + ' ' + resp.last_name + 'eliminado de la BD',
          icon: 'success',
          timer: 3000,
        })
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