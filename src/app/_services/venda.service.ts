import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venda } from '@/_models/venda';
import { DadosPesquisaVendas } from '@/_models/dadosPesquisaVendas';

@Injectable({
  providedIn: 'root'
})

export class VendaService {
  private vendasUrl: string = `${config.apiUrl}/api/orders`;
  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Venda[]> {
    return this.httpClient.get<Venda[]>(this.vendasUrl);
  }

  getById(id: number): Observable<Venda> {
    return this.httpClient.get<Venda>(`${this.vendasUrl}/${id}`);
  }

  save(venda: Venda): Observable<Venda> {
    if (venda.id > 0) {
      return this.httpClient.put<Venda>(`${this.vendasUrl}/${venda.id}`, JSON.stringify(venda), { headers: this.headers });
    } else {
      return this.httpClient.post<Venda>(`${this.vendasUrl}`, JSON.stringify(venda), { headers: this.headers });
    }
  }

  deleteById(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.vendasUrl}/${id}`);
  }

  pesquisarVendasPor(dados: DadosPesquisaVendas): Observable<Venda[]> {
    return this.httpClient.post<Venda[]>(`${this.vendasUrl}/pesquisarVendasPor`, JSON.stringify(dados), { headers: this.headers });
  }
}