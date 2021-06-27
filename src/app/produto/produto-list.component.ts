import { Produto } from '@/_models/produto';
import { AlertService } from '@/_services';
import { DialogConfirmService } from '@/_services/dialogconfirm.service';
import { ProdutoService } from '@/_services/produto.service';
import { Component, OnInit } from '@angular/core';

@Component({ templateUrl: 'produto-list.component.html' })
export class ProdutoListComponent implements OnInit {

  produtosFiltrados: Produto[] = [];
  _produtos: Produto[] = [];
  _filterBy: string;

  constructor(private produtoService: ProdutoService, private alertService: AlertService, private dialogconfirmService: DialogConfirmService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.produtoService.getAll().subscribe({
      next: produtos => {
        this._produtos = produtos;
        this.produtosFiltrados = this._produtos;
      },
      error: err => console.log('Error', err)
    })
  }
  
  deleteById(produtoId: number): void {
    this.dialogconfirmService.confirm('Deseja excluir o produto ?')
    .then((podeDeletar : boolean) => {
        if(podeDeletar) {
          this.produtoService.deleteById(produtoId).subscribe({
            next: () => {
              this.alertService.success("Removido com sucesso", true);
              this.getAll();
            },
            error: err =>{
              this.alertService.error(err);
          }});      
        }
    });     
  }

  // set filter(value: string) {
  //   this._filterBy = value
  //   this.produtosFiltrados = this._produtos.filter((produto: Produto) => produto.name.toLocaleLowerCase().indexOf(this._filterBy.toLocaleLowerCase()) > -1);
  // }

  // get filter() {
  //   return this._filterBy;
  // }
}