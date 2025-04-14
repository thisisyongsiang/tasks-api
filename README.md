# tasks-api
Task management app backend.
# QuickStart
`npm install` to install the depencies

create .env file in root directory.

It will basically need to contain the following variables
```
PORT // the port for the server to listen on
MONGO_DB_uri // the mongodb address. mocked mongo is also possible
JWT_SECRET // any secret string for signing the JWT token
```

To start the server

`npm run start` 

## Thoughts

- It is an app for individuals as part of an organization to track their task
- Everyone can create a task, and edit it but not everyone can delete a task
- Only admins can delete a task
- Undo functionality to work only within a single session. i.e user is unable to undo their actions if it occurred in a different tab or a previous working session
    - Undo functionality for normal users only will undo updating actions as normal users are not allowed to delete and undoing a create function would result in a delete
    - This may lead to potential issue if user is editing on multiple tabs.
    - If any non session changes detected, it is simpler to reset the undo stack to empty
    - Undo is managed entirely on the frontend using react's inbuilt state management
- User login and signup is implemented here, however ideally we would want to use a 3rd party auth provider like Auth0 for added layer of security and possibility of enabling SSO which could enable integration with Google calender which could prove useful
- Roles are set as USER and ADMIN
## TODOs
- Role assignment is not available on the frontend
    - Currently to be an admin, one needs to change the role manually in the mongoDB
- Scaffolding of sharing tasks across users exists in the backend but only as Models in the mongoDB schema
- To enable sharing of tasks we will probably need to have another endpoint to fetch Users, and we will need to redefine the User Model to include an OrgId, which would probably need some rethink in the signup process
- Fetching from mongo will also need to be updated to fetch for tasks that are sharedWith the user
- Undo functionality may be better to be in the Backend if persistence is required, however current solution should be sufficient if simple session persistence is required
- Sanitizing of all text input must be done to prevent XSS attacks, especially since the input UI allows for users to freely format their task title and description, which would be extremely susceptible to injection of malicious code
- Sorting on the frontend is yet to be achieved. But the endpoint currently allows for sorting via createdAt date, dueDate and priority

## Tests
Currently tests are not implemented. Here is a planned testing strategy
### Integration Tests
Use Jest for the test framework. 

For the app at its current state, Integration Tests will be a very much more useful test than unit tests as alot of the heavy lifting is done by the MongoDB and the queries, so mocking of the MongoDB would be useful to provide adequate code coverage for the project
### Mocks

- In memory mongo
- Factory builder patterns to mock test objects
    - We can use Rosie, a 3rd party library for the factory builder patterns
- Randomize the fields for the mock test objects

#### Happy Paths

| Path | Method | Description |
| --- | --- | --- |
| api/tasks/ | POST | Fetch tasks with pagination, filtering and sorting |
| api/tasks/create | POST | Create 1 task |
| api/tasks/update | PUT | Update 1 task |
| api/tasks/:id | DELETE | Delete 1 task |

### Edge Case

#### Fetching Tasks

- Insert Tasks that dont belong to the user and ensure that the tasks are not fetched (can be tested on the happy path)

#### Creating Tasks

- User should not be able to create tasks which do not have title, description, due date specified

#### Updating Tasks

- Updating Tasks that don't belong to the user should not be possible

#### Deleting Tasks

- Deleting tasks that don'tbelong to the user should not be possible

#### Validation

- Validate the expected response data
- Validate the expected response data’s shape
# API Routes
Routes are validated using joi validator

Auth guards are implemented for certain protected routes
## POST api/users/signup

### Request Body:

```jsx
{
	email:String // Must be email. Required
	password:String // Minimum 7 characters must contain 1 lowercase letter, 1 uppercase letter and 1 number. Required
}
```

### Response:

Status Code 201

```jsx
{message:"Successfully signed up"}
```

## POST api/users/login

### Request Body:

```jsx
{
	email:String // Required
	password:String // Required
}
```

### Response:

Status Code 200

```jsx
{
	token:String // JWT token for authentication of subsequent api requests
	user:{
	  id?: string;
	  name: string;
	  email: string;
	  role: Role;
	}
}
```

# Tasks

### Task Type

```jsx
export type Task = {
  id?: string;
  title: string;
  description: string;
  status: Status;
  priority: number;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
  sharedWith?: string[];
};
```

Every route is behind an auth guard which validates the JWT signature in the bearer token

| Path | Method | Description |
| --- | --- | --- |
| api/tasks/ | POST | Fetch tasks with pagination, filtering and sorting |
| api/tasks/create | POST | Create 1 task |
| api/tasks/update | PUT | Update 1 task |
| api/tasks/:id | DELETE | Delete 1 task |

## POST api/tasks/

Fetch tasks with pagination, filtering and sorting

### Request Body:

```jsx
{
  pageNumber: number // Default 1
  pageSize: number // Default 10
  status: "PENDING"|  "IN_PROGRESS"| "COMPLETED"|  "DELETED",
  priority: number // Integer from 0 to 5
  dueDateStart: number // Time in milliseconds
  dueDateEnd: number // Time in milliseconds
  orderBy: "createdAt"|"dueDate"|"priority"
  order: "asc"|"desc"
}
```

### Response:

Status Code 200

```jsx
{
	tasks:Task[]
}
```

## POST api/tasks/create

Create 1 task

### Request Body:

```jsx
{
  title: string // Required
  description: string // Required
  dueDate: number // Time in milliseconds Required
  status: "PENDING"|  "IN_PROGRESS"| "COMPLETED"|  "DELETED"// Default "PENDING"
  priority: number // Integer from 0 to 5. Default 5
}
```

### Response:

Status Code 201

```jsx
{
	task:Task
}
```

## PUT api/tasks/update

Update 1 task

### Request Body:

```jsx
{
	id: string // task Id. Required
  title: string 
  description: string
  dueDate: number 
  status: "PENDING"|  "IN_PROGRESS"| "COMPLETED"|  "DELETED"// 
  priority: number // Integer from 0 to 5
}
```

### Response:

Status Code 200

```jsx
{
	task:Task
}
```

## DELETE api/tasks/:id

Delete 1 task

AdminGuard

### QueryParams:

- id - uuid of the task

### Response:

Status Code 204

