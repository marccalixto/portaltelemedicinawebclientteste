import { Produto } from '@/_models/produto';
import { AlertService } from '@/_services';
import { ProdutoService } from '@/_services/produto.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ templateUrl: 'produto-info.component.html' })
export class ProdutoInfoComponent implements OnInit {
  produtoForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private activatedRoute: ActivatedRoute,
    private produtoService: ProdutoService, 
    private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService) {}

  ngOnInit(): void {
    this.produtoForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.pattern("^[0-9].*$")]],
      description: ['', Validators.required],
      creationDate: [''],
      id: [0]
  });

  // get return url from route parameters or default to '/'
  let id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (id > 0) {
      this.produtoService.getById(id).subscribe({
        next: produto => {
          this.produtoForm.patchValue({
            name: produto.name,
            price: produto.price,
            description: produto.description,
            creationDate: produto.creationDate,
            id: produto.id
          });
        },
        error: err => { console.log('Error', err) }
      });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.produtoForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.produtoForm.invalid) {
        return;
    }

    this.loading = true;
    
    if (this.f.creationDate.value == ""){
    this.produtoForm.patchValue({
      creationDate: new Date(),
    });
  }

    this.produtoService.save(this.produtoForm.value).subscribe({
        next: produto => {
          this.alertService.success("Produto " + produto.name + ", salvo com sucesso", true);
          this.router.navigate(['/produtos']);
      },
        error: err =>{
          this.alertService.error(err);
          this.loading = false;
      }
      });
  }
}
