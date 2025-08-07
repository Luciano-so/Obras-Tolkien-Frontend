import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { OpenLibraryService } from '../../services/open-library.service';
import { LoadingService } from '../../../../shared/loading/service/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-authors-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatExpansionModule, MatIconModule],
  templateUrl: './author-modal.component.html',
  styleUrls: ['./author-modal.component.scss']
})
export class AuthorsModalComponent implements OnInit {
  private openLibrarySrv = inject(OpenLibraryService);
  authorIds: string[] = inject(MAT_DIALOG_DATA);
  private loadingSrv = inject(LoadingService);
  private dialogRef = inject(MatDialogRef<AuthorsModalComponent>);

  authors: any[] = [];

  ngOnInit(): void {
    this.authorIds.forEach(authorId => {
      this.openLibrarySrv.getAuthorBio(authorId)
        .pipe(finalize(() => this.loadingSrv.close()))
        .subscribe(response => {
          const authorWithId = { ...response, authorId };
          this.authors.push(authorWithId);
        });
    });
  }

  get authorsTitle(): string {
    const count = this.authors.length;
    if (count === 1) {
      return 'Propriedade do autor';
    } else {
      return 'Propriedades dos autores';
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  cleanBio(bio: string): string {
    if (!bio) return '';
    bio = bio.replace(/\(\[Source\]\[\d+\]\)/g, '');
    const linkMatch = bio.match(/\[\d+\]:\s*(http[^\r\n]+)/);
    if (linkMatch) {
      bio = bio.replace(/\[\d+\]:\s*http[^\r\n]+/g, '');
      bio += `<br><br>Fonte: <a href="${linkMatch[1]}" target="_blank">${linkMatch[1]}</a>`;
    }
    return bio.trim();
  }
}
