import { DadosPesquisaVendas } from '@/_models/dadosPesquisaVendas';
import { Venda } from '@/_models/venda';
import { AlertService, AuthenticationService } from '@/_services';
import { DialogConfirmService } from '@/_services/dialogconfirm.service';
import { VendaService } from '@/_services/venda.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({ templateUrl: 'venda-list.component.html' })
export class VendaListComponent implements OnInit {

  vendasFiltradas: Venda[] = [];
  _vendas: Venda[] = [];
  _filterBy: string;
  itemForm: FormGroup;

  constructor(private vendaService: VendaService,
    private alertService: AlertService,
    private dialogconfirmService: DialogConfirmService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getAll();
    this.itemForm = this.formBuilder.group({
      dataInicial: [''],
      dataFinal: [''],
      valorInicial: [0],
      valorFinal: [0],
      usuarioId: [0]
    });
  }

  getAll(): void {
    this.vendaService.getAll().subscribe({
      next: vendas => {
        this._vendas = vendas;
        this.vendasFiltradas = this._vendas;
      },
      error: err => console.log('Error', err)
    })
  }

  deleteById(vendaId: number): void {
    this.dialogconfirmService.confirm('Deseja excluir a venda ?')
      .then((podeDeletar: boolean) => {
        if (podeDeletar) {
          this.vendaService.deleteById(vendaId).subscribe({
            next: () => {
              this.alertService.success("Removida com sucesso", true);
              this.getAll();
            },
            error: err => {
              this.alertService.error(err);
            }
          });
        }
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.itemForm.controls; }

  pesquisarVendas(): void {
    this.itemForm.patchValue({
      usuarioId: this.authenticationService.currentUserValue["user"].id
    });

    this.vendaService.pesquisarVendasPor(this.itemForm.value).subscribe({
      next: vendas => {
        this._vendas = vendas;
        this.vendasFiltradas = this._vendas;
      },
      error: err => console.log('Error', err)
    });
  }
}