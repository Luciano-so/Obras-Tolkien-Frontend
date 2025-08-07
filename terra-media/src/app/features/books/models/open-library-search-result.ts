import { OpenLibraryBook } from "./open-library-book";

export interface OpenLibrarySearchResult {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}
