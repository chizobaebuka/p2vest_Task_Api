# p2vest_Task_Api

## ABOUT THE PROJECT
This project is a comprehensive Multi-User Task Management API designed to demonstrate backend development skills and proficiency. The API supports user management with role-based access control, allowing both regular users and admins to manage tasks efficiently. The project is built with the following key features:

## Built With
This project was built with sequelize, typescipt, ts-node-dev, express dotenv jsonwebtoken zod pg

## GETTING STARTED TO RUN THE PROJECT
To get your copy of the project running locally on your system, follow the steps below
1. git clone git@github.com:chizobaebuka/p2vest_Task_Api.git
2. npm install 
3. npx tsc to compile the project
3. create a db in your local postgres database and suit your configuration according to the .env.sample file
4. Start the server using npm run dev
5. Start testing the api using your local swagger url
http://localhost:3030/api-docs/#


## FEATURES IMPLEMENTED
1. USERS MANAGEMENT 
    Registration and Login: Users can register and log in to the system with JWT authentication. There are two roles: Admin and Regular User. Only Admins can create other Admins.
   - Register User to the db
   - Login User 
   - Get all users from the db
   - Admin Creates Admin User to the db
2. Task Management 
    Users can create tasks, assign tasks to themselves and others, update the status of their task and only admins have the priviledge to update any task's status-
   - Users create tasks
   - Users can assign tasks to themselves
   -  Users can update the status of their tasks and only admins can update any task's status
   - Users can add tags to tasks 
   - Only a user with an admin role can get all tasks
   - Users can apply filters and get all tasks 
3. COMMENTING SYSTEM
    Users can add, edit, and delete comments on tasks. Admins have the ability to delete any comment
   - Users can add comments on tasks
   - Users can edit comments on tasks
   - Users can delete comments on tasks
   - Users can view all comments
4. NOTIFICATION SYSTEM
    Users are notified when they are assigned a task or when the status of a task they are involved in is updated. Implemented socket io for this and saved the information of the notication
5. VALIDATION 
    For validating payloads implemented zod for payloads implemented
