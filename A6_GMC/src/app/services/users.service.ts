import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Ipages } from '../interfaces/ipages.interface';
import { Iuser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl: string = 'https://peticiones.online/api/users/?page=';

  ///Inyectando httpClient
  private httpClient = inject(HttpClient);
  private pagesArray: Ipages[] = [];


  /// Recogemos la primera pagina del la API
  private getPage(n: number): Promise<Ipages> {
    const urlPage = this.apiUrl + n;
    // firstValueFrom nos transforma un observable en una promesa
    return firstValueFrom(this.httpClient.get<Ipages>(urlPage));
  }

  async getAllUsers(): Promise<Iuser[]> {
    let users: Iuser[] = [];
    const firstpage = await this.getPage(1);
    const n_pages = firstpage.total_pages;
    for (let i = 1; i <= n_pages; i++) {
      const page = await this.getPage(i);
      users = users.concat(page.results);
    }
    return users;
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

