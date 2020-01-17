# API for Ikutan App

RESTful API for authentication user, crud event, and join / unjoin some event.

## Endpoints

### User

| Method | Endpoint | Description | Data |
| ------ | -------- | ----------- | ---- |
| POST | api/users/register | Register a new user | { "status": "", "msg": "", "data": { "uid": "" } } |
| POST | api/users/login | Login for user | { "status": "", "msg": "", "data": { "auth-token": "" } } |

### Event

| Method | Endpoint | Description | Data |
| ------ | -------- | ----------- | ---- |
| GET | api/events | List of events | { "status": "", "msg": "", "data": [{}, {}, {}] } |
| GET | api/events/:id | View a event | { "status": "", "msg": "", "data": {} } |
| GET | api/events/participants/:id | View all participant has join the event | { "status": "", "msg": "", "data": {} } |
| POST | api/events | Create a new event | { "status": "", "msg": "", "data": { "id": "" } } |
| PUT | api/events/:id | Update a event | { "status": "", "msg": "", "data": { "id": "" } } |
| PUT | api/events/join/:id | Join the event | { "status": "", "msg": "" } |
| DELETE | api/events/:id | Delete a event | { "status": "", "msg": "" } |
| DELETE | api/events/join/:id | Cancel join the event | { "status": "", "msg": "" } |
