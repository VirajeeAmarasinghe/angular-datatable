import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Data } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { AppModule } from '../app.module';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [FormsModule, HttpClientModule, AppModule, CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent implements OnInit {
  comments: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  rowsPerPage: number = 10;
  sortOrder: string = 'asc';
  sortColumn: string = 'id';
  isLoading: boolean = true;
  isEditing: boolean = false;
  editingComment: any = null;

  private searchSubject: Subject<string> = new Subject();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchComments();
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchText) => {
      this.searchQuery = searchText;
      this.updatePage();
    });
  }

  fetchComments(): void {
    this.isLoading = true;
    this.dataService.getComments().subscribe((data) => {
      this.comments = data;
      this.isLoading = false;
    });
  }

  paginatedComments(): any[] {
    let filteredComments = this.comments.filter(
      (comment) =>
        comment.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        comment.body.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    filteredComments.sort((a, b) => {
      const modifier = this.sortOrder === 'asc' ? 1 : -1;
      if (a[this.sortColumn] < b[this.sortColumn]) return -1 * modifier;
      if (a[this.sortColumn] > b[this.sortColumn]) return 1 * modifier;
      return 0;
    });
    if (this.rowsPerPage === 0) {
      return filteredComments;
    }
    const start = (parseInt(this.currentPage.toString()) - 1) * this.rowsPerPage;
    const end = start + parseInt(this.rowsPerPage.toString());
    return filteredComments.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.comments.length / this.rowsPerPage);
  }

  prevPages(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    const nextPageNumber = this.currentPage + 1;
    if (nextPageNumber <= this.totalPages) {
      this.currentPage = nextPageNumber;
    }
  }

  updatePage(): void {
    this.currentPage = 1;
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.updatePage();
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  editComment(comment: any): void {
    this.isEditing = true;
    this.editingComment = { ...comment };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingComment = null;
  }

  updateComment(): void {
    const index = this.comments.findIndex(
      (c) => c.id === this.editingComment.id
    );
    if (index !== -1) {
      this.comments.splice(index, 1, { ...this.editingComment });
    }
    this.cancelEdit();
  }

  removeComment(id: number): void {
    const index = this.comments.findIndex((comment) => comment.id === id);

    if (index !== -1) {
      this.comments.splice(index, 1);
    }
  }
}
