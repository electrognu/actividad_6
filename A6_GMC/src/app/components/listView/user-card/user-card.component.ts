import { Component, inject, Input, Type } from '@angular/core';
import { Iuser } from '../../../interfaces/iuser.interface';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  userService = inject(UsersService);
  @Input('userOnCard') user: Iuser | null = null;


  isIuser(obj: any): obj is Iuser {
    return 'first_name' in obj && 'last_name' in obj;
  }

  async deleteuser(id: string) {
    let sar = await Swal.fire({
      title: 'Seguro que quieres eliminar',
      text: 'al usuario: ' + this.user?.first_name + ' ' + this.user?.last_name,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo'
    })
    if (sar.isConfirmed) {
      try {
        const resp = await this.userService.deleteUserById(id);
        if (this.isIuser(resp)) {
          let sar = await Swal.fire({
            title: 'Eliminado con exito',
            text: 'Usuario:' + resp.first_name + ' ' + resp.last_name + ' ',
            icon: 'success',
            timer: 3000,
          })
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
