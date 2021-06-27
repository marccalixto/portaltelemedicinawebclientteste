import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '@/_models/produto';

@Injectable({
  providedIn: 'root'
})

export class ProdutoService {

  private produtosUrl: string = `${config.apiUrl}/api/products`;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Produto[]> {
    return this.httpClient.get<Produto[]>(this.produtosUrl);
  }

  getById(id: number): Observable<Produto> {
    return this.httpClient.get<Produto>(`${this.produtosUrl}/${id}`);
  }

  save(produto: Produto): Observable<Produto> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    if (produto.id > 0) {
      return this.httpClient.put<Produto>(`${this.produtosUrl}/${produto.id}`, JSON.stringify(produto), { headers: headers });
    } else {
      return this.httpClient.post<Produto>(`${this.produtosUrl}`, JSON.stringify(produto), { headers: headers });
    }
  }

  deleteById(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.produtosUrl}/${id}`);
  }
}