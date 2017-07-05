import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../interfaces/user';
import {Store} from '@ngrx/store';
import {AppState} from '../interfaces/appstate';

@Injectable()
export class UserService {

    private BASE_URL = 'https://demo-redux-vadimn92.c9users.io';
    private syncedUsers = [];

    constructor (private http: Http, private store: Store<AppState>) {}

    public getUsers(): Observable<User[]> {
        return this.http.get(this.BASE_URL + '/api/users')
            .map(res => res.json());
    }

    public getUser(id): Observable<User> {
        return this.http.get('/api/users/' + id)
            .map(res => res.json());
    }

    public addUser(user) {
        return this.http.post(this.BASE_URL + '/api/users', user)
            .map(res => res.json());
    }

    public editUser(user: User) {
        return this.http.put(this.BASE_URL + '/api/users/' + user.localId, user)
            .map(res => res.json());
    }

    public deleteUser(user) {
        return this.http.delete(this.BASE_URL + '/api/users/' + user.id)
            .map(res => user);
    }

    public syncUsers(users, index = 0) {

        if (!users.length) {

            return Observable.of(this.syncedUsers);
        }

        this.addUser(users[index]).subscribe((response) => {
            this.syncedUsers.push(response);
            if (index < users.length - 1) {
                this.syncUsers(users, ++index);

                return;
            }
        })
        this.syncedUsers = [];

        return Observable.of(this.syncedUsers);
    }
}
