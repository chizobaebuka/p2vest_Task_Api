# p2vest_Task_Api

## ABOUT THE PROJECT
This project is a comprehensive Multi-User Task Management API designed to demonstrate backend development skills and proficiency. The API supports user management with role-based access control, allowing both regular users and admins to manage tasks efficiently. The project is built with the following key features:

## Built With
This project was built with sequelize, typescipt, ts-node-dev, express dotenv jsonwebtoken zod pg

## GETTING STARTED TO RUN THE PROJECT
To get your copy of the project running locally on your system, follow the steps below
1. git clone git@github.com:chizobaebuka/p2vest_Task_Api.git
2. npm install
3. Create a db in your local postgres database and copy `.env.sample` to `.env`, filling in your configuration (`JWT_SECRET` is required - the server refuses to start without it)
4. Run `npm run migrate` to apply the database schema. **This step is mandatory** - the server no longer auto-syncs the schema on boot (see [Scalability](#scalability) for why), so a fresh clone with no migrations applied will fail to start correctly.
5. Start the server using `npm run dev`
6. Start testing the api using your local swagger url
http://localhost:3030/api-docs/#


## FEATURES IMPLEMENTED
1. USERS MANAGEMENT 
    Registration and Login: Users can register and log in to the system with JWT authentication. There are two roles: Admin and Regular User. Only Admins can create other Admins.
   - Register User to the db
   - Login User 
   - Get all users from the db
   - Admin Creates Admin User to the db
2. Task Management 
    Users can create tasks, assign tasks to themselves and others, update the status of their task and only admins/the task's creator have the privilege to assign or update the status of a task-
   - Users create tasks
   - Users can assign tasks to themselves or others - only the task's creator or an Admin may (re)assign a task
   - Users can update the status of their tasks and only admins can update any task's status
   - Users can attach one or more tags to a task (many-to-many)
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

## DATA CONSISTENCY & CONCURRENCY (ACID)
- **Atomicity**: Multi-step task mutations (assign, status update, tag attachment) run inside a single Sequelize `transaction`. Each of these also creates a `Notification` row as part of the same write - if any step fails, the whole operation rolls back rather than leaving a task updated with no notification (or vice versa).
- **Isolation**: The task row is read with `SELECT ... FOR UPDATE` (`Transaction.LOCK.UPDATE`) inside the transaction before being mutated, so two concurrent requests against the same task (e.g. two admins assigning it at once) serialize instead of racing - the second request's lock wait ends only after the first commits, and it then operates on the up-to-date row. This closes a lost-update race that existed in the original read-then-save implementation.
- **Consistency**: Foreign keys (`createdById`, `assignedToId`, tag associations) are enforced at the database level, and a unique constraint on `(taskId, tagId)` prevents duplicate tag attachments. Authorization rules (only an Admin or a task's creator may assign it or change its status) are enforced in the same transaction as the mutation, not as a separate racy check-then-act step.
- **Durability**: All of the above is committed via Postgres; the Redis cache is a write-through, best-effort layer on top and is never the source of truth. Caching is never used to *decide* whether a write happens - only to accelerate subsequent reads of already-committed data.

## SCALABILITY
- **Connection pooling**: `sequelize.ts` configures a bounded connection pool (`DB_POOL_MAX`/`DB_POOL_MIN`/etc, see `.env.sample`) instead of relying on defaults, so the API behaves predictably under concurrent load.
- **Indexes**: Foreign key and filter/sort columns (`tasksTable.createdById/assignedToId/status/dueDate`, `commentsTable.taskId/userId`, `notificationsTable.userId/taskId`) are indexed via migration - Postgres does not index foreign keys automatically, and these are exactly the columns the API filters and joins on.
- **Schema managed by migrations only**: the server no longer calls `sequelize.sync()` on boot. Running `sync()` alongside `sequelize-cli` migrations is redundant, and on a horizontally scaled deployment (multiple instances/replicas booting concurrently, rolling deploys) concurrent `sync()` DDL calls can race against migrations and each other. `npm run migrate` is now the single source of schema truth - see Getting Started above.
- **Bounded caching**: Redis cache entries now carry a TTL (`REDIS_TTL_SECONDS`, default 300s) instead of living forever, and task mutations actively invalidate the specific `task:{id}` / `task_status:{id}` / `tasks:all` keys they affect. This bounds Redis memory growth and removes a mechanism where a stale cache entry could survive indefinitely.
- **Rate limiting**: `/api/auth/signin` and `/api/auth/signup` are rate-limited per IP to blunt credential-stuffing/brute-force attempts, which otherwise scale linearly with attacker resources against a stateless JWT API.
- **Stateless auth**: JWT-based auth means any number of API instances can be run behind a load balancer with no shared session state required.

## KNOWN LIMITATIONS
- `getAllTasksWithFilters` caches results per distinct filter combination (`tasks:filters:{...}`). Rather than actively invalidating every possible filter permutation on every task mutation (impractical to enumerate), these entries are left to expire via the Redis TTL. This means filtered task listings can be up to `REDIS_TTL_SECONDS` stale after a mutation, while `GET /get-task/:taskId` and the assign/status-update responses themselves always reflect the just-committed state.
- The Redis cache is a single instance with no HA/clustering configured; if Redis is unavailable, reads and writes fall back to Postgres directly (cache operations are wrapped in try/catch and logged, never block a request), but caching benefits are lost until Redis recovers.
