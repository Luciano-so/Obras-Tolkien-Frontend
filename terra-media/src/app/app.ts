import { Component, signal, inject, OnInit } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './shared/loading/component/loading.component';
import { LoadingService } from './shared/loading/service/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSnackBarModule, CommonModule, LoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('terra-media');
  showPreload = false;

  private readonly loadingService = inject(LoadingService);

  ngOnInit() {
    this.loadingService.state$.subscribe((response: boolean) => {
      setTimeout(() => {
        this.showPreload = response;
      });
    });
  }
}
