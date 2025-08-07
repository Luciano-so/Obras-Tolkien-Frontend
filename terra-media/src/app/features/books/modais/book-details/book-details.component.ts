import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenLibraryBook } from '../../models/open-library-book';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent {
  @Input() book!: OpenLibraryBook;
}
