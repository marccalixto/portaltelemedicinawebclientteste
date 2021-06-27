import { User } from '@/_models';
import { AlertService, AuthenticationService } from '@/_services';
import { VendaService } from '@/_services/venda.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VendaItemsComponent } from '../venda-items';

@Component({ templateUrl: 'venda-info.component.html' })
export class VendaInfoComponent implements OnInit {
  vendaForm: FormGroup;
  loading = false;
  submitted = false;
  produtosDaVenda = [];
  detalhando = false;

  constructor(private activatedRoute: ActivatedRoute,
    private vendaService: VendaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.vendaForm = this.formBuilder.group({
      totalValue: [0, [Validators.required, Validators.min(0.01)]],
      creationDate: [''],
      id: [0],
      usuarioId: [0],
      items: []
    });

    // get return url from route parameters or default to '/'
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.detalhando = (this.activatedRoute.snapshot.paramMap.get('detalhe') == "1");

    if (id > 0) {
      this.vendaService.getById(id).subscribe({
        next: venda => {
          this.vendaForm.patchValue({
            totalValue: venda.totalValue,
            creationDate: venda.creationDate,
            id: venda.id,
            usuarioId: venda.usuarioId,
            items: venda.items
          });
          this.produtosDaVenda = venda.items;
        },
        error: err => { console.log('Error', err) }
      });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.vendaForm.controls; }

  AddEditItem(orderItemIndex, orderId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, orderId, produtosDaVenda: this.produtosDaVenda };
    this.dialog.open(VendaItemsComponent, dialogConfig).afterClosed()
      .subscribe(response => {
        this.updateTotal();
      });
  }

  updateTotal() {
    var valorTotal = this.produtosDaVenda.reduce(function (prev, prod) {
      return prev + (prod.quantity * prod.price);
    }, 0);

    let valor = parseFloat((valorTotal).toFixed(2));
    this.vendaForm.patchValue({
      totalValue: valor
    });
  }

  deleteProdutoDaVenda(produtoId) {
    var position = this.produtosDaVenda.findIndex(prod => prod.produto.id == produtoId);
    if (position >= 0) {
      this.produtosDaVenda.splice(position, 1);

      this.vendaForm.patchValue({
        items: this.produtosDaVenda
      });

      this.updateTotal();
    }
  }

  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.vendaForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.f.creationDate.value == "") {
      this.vendaForm.patchValue({
        creationDate: new Date(),
      });
    }

    if (this.f.usuarioId.value == 0 || this.f.usuarioId.value == null) {
      this.vendaForm.patchValue({
        usuarioId: this.authenticationService.currentUserValue["user"].id
      });
    }

    this.vendaForm.patchValue({
      items: this.produtosDaVenda.map(function (item) {
        return {
          price: item.price,
          produto: item.produto,
          quantity: item.quantity
        }
      })
    });

    this.vendaService.save(this.vendaForm.value).subscribe({
      next: venda => {
        this.alertService.success("Venda salva com sucesso", true);
        this.router.navigate(['/vendas']);
      },
      error: err => {
        this.alertService.error(err);
        this.loading = false;
      }
    });
  }
}
