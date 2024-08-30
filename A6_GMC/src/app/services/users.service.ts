import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Ipages } from '../interfaces/ipages.interface';
import { Iuser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl: string = 'https://peticiones.online/api/users/';

  ///Inyectando httpClient
  private httpClient = inject(HttpClient);

  /// Recogemos la primera pagina del la API
  private getPage(n: number): Promise<Ipages> {
    // this.httpClient.get nos devuelve un observable
    // firstValueFrom nos transforma un observable en una promesa
    return firstValueFrom(this.httpClient.get<Ipages>(`${this.apiUrl}?page=${n}`));
  }

  async getAllUsers(): Promise<Iuser[]> {
    let users: Iuser[] = [];
    const firstpage = await this.getPage(1); // así nos aseguramos de que funciona si el numero de paginas cambia.
    for (let i = 1; i <= firstpage.total_pages; i++) {
      const page = await this.getPage(i);
      users = users.concat(page.results);
    }
    return users;
  }

  // REFACTORIZADA POR AI CODEIUM
  // async getAllUsers(): Promise<Iuser[]> {
  //   const pages = await Promise.all(
  //     Array.from({ length: (await this.getPage(1)).total_pages }, (_, i) => this.getPage(i + 1))
  //   );
  //   return pages.flatMap(page => page.results);
  // }

  getUserById(id: string): Promise<Iuser> {
    return firstValueFrom(this.httpClient.get<Iuser>(this.apiUrl + id));
  }

  deleteUserById(id: string): Promise<Iuser> {
    return firstValueFrom(this.httpClient.delete<Iuser>(this.apiUrl + id));
  }


}














// getTotalPages(): number {
//   let total_pages = 4
//   const firstPage = this.getBasePage().subscribe((data: Ipages) => {
//     total_pages = Number(data.total_pages);
//     console.log(total_pages);
//   });

//   return total_pages;
// }

