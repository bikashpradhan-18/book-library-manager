export interface Book {
    id: number;
    title: string;
    author: string;
    description?: string;
    // posterUrl?: string;
    requestedBy?: number;
}