import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${config.apiUrl}/api/signup`);
    }

    register(user: User) {
        return this.http.post(`${config.apiUrl}/api/signup`, user);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/api/signup/${id}`);
    }
}