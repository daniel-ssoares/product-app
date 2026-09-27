import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root', standalone: true, imports: [RouterOutlet, RouterLink],
  template: `<header class="topbar"><a routerLink="/products" class="brand"><span class="brand-mark">m.</span><span>mesa<span class="brand-light"> & máquina</span></span></a><span class="topbar-label">GESTÃO DE INVENTÁRIO</span></header><main class="shell"><router-outlet /></main><footer class="footer">Mesa & Máquina · Ferramentas para uma rotina melhor</footer>`
})
export class AppComponent {}
