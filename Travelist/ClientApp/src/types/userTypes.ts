export interface User {
    email: string;
    username: string;
    name: string;
    imageUrl: string | null;
}

export interface PublicUser {
    name: string;
    username: string;
    imageUrl: string | null;
}