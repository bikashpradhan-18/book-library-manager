export type Role = 'Admin' | 'User';

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: Role;
}
