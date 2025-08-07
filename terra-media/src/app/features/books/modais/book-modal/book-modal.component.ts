import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { BooksService } from '../../services/books.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-authors-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatExpansionModule, MatIconModule],
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.scss']
})
export class BookModalComponent implements OnInit {
  private authorService = inject(BooksService);
  authorIds: string[] = inject(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef<BookModalComponent>);

  authors: any[] = [];

  ngOnInit(): void {
    this.authorIds.forEach(authorId => {
      this.authorService.getAuthorBio(authorId).subscribe(response => {
        this.authors.push(response);
      });
    });
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
