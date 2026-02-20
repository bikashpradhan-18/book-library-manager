import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';
import { Book } from '../models/book.model';

@Injectable({
    providedIn: 'root',
})
export class MockDbService {
    private users: User[] = [];
    private books: Book[] = [];

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.init();
    }

    private init() {
        if (isPlatformBrowser(this.platformId)) {
            const storedUsers = localStorage.getItem('users');
            const storedBooks = localStorage.getItem('books');

            if (storedUsers) {
                this.users = JSON.parse(storedUsers);
            } else {
                this.seedUsers();
                this.persistUsers();
            }

            if (storedBooks) {
                this.books = JSON.parse(storedBooks);
            } else {
                this.seedBooks();
                this.persistBooks();
            }
        }
    }

    private seedUsers() {
        this.users = [
            {
                id: 1,
                name: 'Admin',
                email: 'admin@library.com',
                password: 'admin123',
                role: 'Admin',
            },
            {
                id: 2,
                name: 'John Doe',
                email: 'john@library.com',
                password: 'user123',
                role: 'User',
            },
            {
                id: 3,
                name: 'Jane Smith',
                email: 'jane@library.com',
                password: 'user123',
                role: 'User',
            },
        ];
    }

    private seedBooks() {
        this.books = [
            {
                id: 1,
                title: 'Atomic Habits',
                author: 'James Clear',
                description: 'A practical guide to building good habits.',
            },
            {
                id: 2,
                title: 'Clean Code',
                author: 'Robert C. Martin',
                description: 'A handbook of agile software craftsmanship.',
            },
            {
                id: 3,
                title: 'The Pragmatic',
                author: 'Andrew Hunt & David Thomas',
                description: 'Classic guide to software craftsmanship and pragmatic thinking.',
            },
            {
                id: 4,
                title: 'Deep Work',
                author: 'Cal Newport',
                description: 'Rules for focused success in a distracted world.',
            },
            {
                id: 5,
                title: 'Design Patterns',
                author: 'Erich Gamma et al.',
                description: 'Elements of reusable object-oriented software.',
            },
            {
                id: 6,
                title: 'You Don’t Know JS',
                author: 'Kyle Simpson',
                description: 'In-depth exploration of JavaScript core mechanisms.',
            }
        ];
    }

    // ---- USERS ----
    getUsers(): User[] {
        return [...this.users];
    }

    addUser(user: User) {
        const highestId = this.users.length
            ? Math.max(...this.users.map(u => u.id ?? 0))
            : 0;

        user.id = highestId + 1;

        this.users.push(user);
        this.persistUsers();
    }

    updateUser(updated: User) {
        const index = this.users.findIndex(u => u.id == updated.id);
        if (index != -1) {
            this.users[index] = updated;
            this.persistUsers();
        }
    }

    deleteUser(id: number) {
        this.users = this.users.filter(u => u.id != id);
        this.persistUsers();
    }

    // ---- BOOKS ----
    getBooks(): Book[] {
        return [...this.books];
    }

    updateBook(book: Book) {
        const index = this.books.findIndex(b => b.id == book.id);
        if (index != -1) {
            this.books[index] = book;
            this.persistBooks();
        }
    }

    requestBook(bookId: number, userId: number) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            book.requestedBy = userId;
            this.persistBooks();
        }
    }


    // ---- Persistence ----
    private persistUsers() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    private persistBooks() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('books', JSON.stringify(this.books));
        }
    }
}
