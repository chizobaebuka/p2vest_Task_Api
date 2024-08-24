import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    swagger: '2.0',
    info: {
        title: 'p2vest Multi User Task Management API',
        version: '1.0.0',
        description: 'API for managing tasks',
    },
    paths: {
        '/api/auth/signup': {
            post: {
                summary: 'Register a new user',
                description: 'Registers a new user with the provided details',
                tags: ['Users'],
                parameters: [
                    {
                        in: 'body',
                        name: 'user',
                        description: 'User details',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                firstName: {
                                    type: 'string',
                                    description: 'The first name of the user',
                                },
                                lastName: {
                                    type: 'string',
                                    description: 'The last name of the user',
                                },
                                email: {
                                    type: 'string',
                                    description: 'The email of the user',
                                    format: 'email',
                                },
                                password: {
                                    type: 'string',
                                    description: 'The password of the user',
                                },
                                role: {
                                    type: 'string',
                                    enum: ['Admin', 'Regular'],
                                },
                            },
                        },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/User',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User registered successfully',
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/auth/signin': {
            post: {
                summary: 'Login a user',
                description: 'Login a user with the provided email and password',
                tags: ['Users'],
                parameters: [
                    {
                        in: 'body',
                        name: 'user',
                        description: 'User credentials',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type:'string',
                                    description: 'The email of the user',
                                    format: 'email',
                                },
                                password: {
                                    type:'string',
                                    description: 'The password of the user',
                                },
                            },
                        },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/User',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User logged in successfully',
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                }
            }
        },
        '/api/auth/all-users': {
            get: {
                summary: 'Get all users',
                description: 'Only with an Admin role Returns all users',
                tags: ['Users'],
                parameters: {},
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'OK',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/definitions/User',
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            } 
        },
        '/api/auth/create-admin': {
            post: {
                summary: 'Create an admin user',
                description: 'Only Admin role creates an admin user with the provided details',
                tags: ['Users'],
                parameters: [
                    {
                        in: 'body',
                        name: 'user',
                        description: 'Admin user details',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                firstName: {
                                    type: 'string',
                                    description: 'The first name of the user',
                                },
                                lastName: {
                                    type: 'string',
                                    description: 'The last name of the user',
                                },
                                email: {
                                    type: 'string',
                                    description: 'The email of the user',
                                    format: 'email',
                                },
                                password: {
                                    type: 'string',
                                    description: 'The password of the user',
                                },
                                role: {
                                    type: 'string',
                                    enum: ['Admin'],
                                },
                            },
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    201: {
                        description: 'Admin user created successfully',
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/task/tasks': {
            post: {
                summary: 'Create a new task',
                description: 'Creates a new task with the provided details',
                tags: ['Tasks'],
                parameters: [
                    {
                        in: 'body',
                        name: 'task',
                        description: 'Task details',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                title: {
                                    type: 'string',
                                    description: 'The title of the task',
                                },
                                description: {
                                    type: 'string',
                                    description: 'The description of the task',
                                },
                                status: {
                                    type: 'string',
                                    enum: ['Pending', 'In Progress', 'Completed'],
                                },
                            },
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    201: {
                        description: 'Task created successfully',
                        schema: {
                            $ref: '#/definitions/Task',
                        },
                    },
                    400: {
                        description: 'Bad Request',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/task/{taskId}/assign/{assignedToId}': {
            put: {
                summary: 'Assign a task to a user',
                description: 'Assigns a task to a user with the provided task ID and user ID',
                tags: ['Tasks'],
                parameters: [
                    {
                        in: 'path',
                        name: 'taskId',
                        description: 'The ID of the task to be assigned',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                    {
                        in: 'path',
                        name: 'assignedToId',
                        description: 'The ID of the user to whom the task will be assigned',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Task assigned successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Task assigned successfully',
                                        },
                                        task: {
                                            $ref: '#/definitions/Task',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Bad Request',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Assigned user ID is required',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/task/{taskId}/status': {
            put: {
                summary: 'Update task status',
                description: 'Updates the status of a task with the provided task ID',
                tags: ['Tasks'],
                parameters: [
                    {
                        in: 'path',
                        name: 'taskId',
                        description: 'The ID of the task to be updated',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                    {
                        in: 'body',
                        name: 'taskStatus',
                        description: 'The new status of the task',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                status: {
                                    type:'string',
                                    enum: ['Pending', 'In Progress', 'Completed'],
                                },
                            },
                        },
                    }
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Task status updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Task status updated successfully',
                                        },
                                        task: {
                                            $ref: '#/definitions/Task',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Bad Request',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Invalid status provided',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        },
                                    }
                                }
                            }
                        }
                    },
                },
            }
        },
        '/api/task/{taskId}/add-tags': {
            post: {
                summary: 'Add Tags to A Task',
                description: 'Login as a Regular User to Adds tags to a task with the provided task ID',
                tags: ['Tasks'],
                parameters: [
                    {
                        in: 'path',
                        name: 'taskId',
                        description: 'The ID of the task to which tags will be added',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                    {
                        in: 'body',
                        name: 'tags',
                        description: 'The tags to be added to the task',
                        required: true,
                        schema: {
                            type: 'array',
                            items: {
                                type:'string',
                            },
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Tags added to the task successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Tags added to the task successfully',
                                        },
                                        task: {
                                            $ref: '#/definitions/Task',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Bad Request',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'At least one tag is required',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }
        },
        '/api/task/all-tasks': {
            get: {
                summary: 'Lists all tasks',
                description: 'Lists all tasks in the system',
                tags: ['Tasks'],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'All tasks retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/definitions/Task',
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Error retrieving tasks',
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }
        },
        '/api/task/filtered-tasks': {
            get: {
                summary: 'Lists tasks based on filters',
                description: 'Lists tasks in the system based on provided filters',
                tags: ['Tasks'],
                parameters: [
                    {
                        in: 'query',
                        name: 'page',
                        description: 'Filter tasks by page',
                        schema: {
                            type:'number',
                        },
                    },
                    {
                        in: 'query',
                        name: 'limit',
                        description: 'Filter tasks by limit',
                        schema: {
                            type:'number',
                        },
                    },
                    {
                        in: 'query',
                        name:'status',
                        description: 'Filter tasks by status (Pending, In Progress, Completed)',
                        schema: {
                            type:'string',
                            enum: ['Pending', 'In Progress', 'Completed'],
                        },
                    },
                    {
                        in: 'query',
                        name: 'sortBy',
                        description: 'sorts by the provided field',
                        schema: {
                            type:'string',
                            format: 'uuid',
                        },
                    },
                    {
                        in: 'query',
                        name: 'sortOrder',
                        description: 'orders the filters in asc or desc',
                        schema: {
                            type:'string',
                            format: 'uuid',
                        },
                    },
                    {
                        in: 'query',
                        name: 'dueDate',
                        description: 'Filter tasks by dueDate of the task',
                        schema: {
                            type:'string',
                        },
                    },
                    {
                        in: 'query',
                        name: 'tagId',
                        description: 'Filter tasks by tag ID',
                        schema: {
                            type:'string',
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Filtered tasks retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        tasks: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/definitions/Task',
                                            },
                                        },
                                        totalCount: {
                                            type: 'number',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: "string",
                                            example: 'Error retrieving tasks',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/task/{taskId}': {
            delete: {
                summary: 'Delete a task',
                description: 'Delete a task by its ID',
                tags: ['Tasks'],
                parameters: [
                    {
                        in: 'path',
                        name: 'taskId',
                        description: 'The ID of the task',
                        schema: {
                            type: 'string',
                        },
                    }
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Task deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Task deleted successfully',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Task not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Task not found',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }
        },
        '/api/comment/add-comment/{taskId}': {
            post: {
                summary: 'Add Comment to Task',
                description: 'Adds a comment to a task',
                tags: ['Comments'],
                parameters: [
                    {
                        in: 'path',
                        name: 'taskId',
                        description: 'The ID of the task',
                        schema: {
                            type: 'string',
                            format: 'uuid',
                        },
                    },
                    {
                        in: 'body',
                        name: 'comment',
                        description: 'The comment to be added',
                        schema: {
                            type: 'object',
                            properties: {
                                content: {
                                    type: 'string',
                                    description: 'The content of the comment',
                                },
                            },
                        },
                    }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    content: {
                                        type: 'string',
                                        description: 'The content of the comment',
                                    },
                                },
                            },
                        },
                    },
                },
                security: [{ JWTAuth: [] }],
                responses: {
                    201: {
                        description: 'Comment added successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Comment added successfully',
                                        },
                                        comment: {
                                            $ref: '#/definitions/Comment',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        }
                                    }
                                }
                            }
                        },
                    },
                    404: {
                        description: 'Task Not Found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Task not found',
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Error adding comment',
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }
        },
        '/api/comment/edit-comment/{commentId}': {
            put: {
                summary: 'Edit Comment',
                description: 'Edits an existing comment',
                tags: ['Comments'],
                parameters: [
                    {
                        in: 'path',
                        name: 'commentId',
                        description: 'The ID of the comment',
                        schema: {
                            type:'string',
                            format: 'uuid',
                        },
                    },
                    {
                        in: 'body',
                        name: 'comment',
                        description: 'The updated comment',
                        schema: {
                            type: 'object',
                            properties: {
                                content: {
                                    type: 'string',
                                    description: 'The new content of the comment',
                                },
                            },
                        },
                    }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    content: {
                                        type: 'string',
                                        description: 'The new content of the comment',
                                    },
                                },
                            },
                        },
                    },
                },
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Comment edited successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        }
                                    }
                                }
                            }
                        },
                    },
                    404: {
                        description: 'Comment Not Found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Comment not found',
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Error editing comment',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }
        },
        '/api/comment/delete-comment/{commentId}': {
            delete: {
                summary: 'Delete Comment',
                description: 'Delete an existing comment',
                tags: ['Comments'],
                parameters: [
                    {
                        in: 'path',
                        name: 'commentId',
                        description: 'The ID of the comment',
                        schema: {
                            type: 'string',
                            format: 'uuid',
                        },
                    }
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    201: {
                        description: 'Comment deleted successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        }
                                    }
                                }
                            }
                        },
                    },
                    404: {
                        description: 'Comment Not Found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Comment not found',
                                        }
                                    }
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Error deleting comment',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/comment/all-comments': {
            get: {
                summary: 'Get All Comments',
                description: 'Get all comments',
                tags: ['Comments'],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'All comments fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'All comments fetched successfully',
                                        },
                                        comments: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/definitions/Comment',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'No token provided',
                                        }
                                    }
                                }
                            }
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Error fetching comments',
                                        }
                                    }
                                }
                            }
                        },
                    },
                },
            }
        },
        '/api/tag/add-tag': {
            post: {
                summary: 'Add Tag',
                description: 'Adds a new tag',
                tags: ['Tags'],
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        in: 'body',
                        name: 'tag',
                        description: 'The name of the tag to create',
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type:'string',
                                    description: 'The name of the tag',
                                },
                            },
                        },
                    }
                ],
                responses: {
                    201: {
                        description: 'Tag added successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type:'string',
                                            example: 'Tag added successfully',
                                        },
                                        tag: {
                                            $ref: '#/definitions/Tag',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type:'string',
                                            example: 'No token provided',
                                        }
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type:'string',
                                            example: 'Error adding tag',
                                        }
                                    },
                                },
                            },
                        },
                    },
                },
            }
        },
    },
    securityDefinitions: {
        JWTAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    definitions: {
        Task: {
            type: "object",
            properties: {
                id: { 
                    type: "string", 
                    format: "uuid" 
                },
                title: { 
                    type: "string" 
                },
                description: { 
                    type: "string" 
                },
                status: { 
                    type: "string", 
                    enum: ["Pending", "In Progress", "Completed"] 
                },
                createdById: { 
                    type: "string", 
                    format: "uuid",
                    description: "References the User who created the task",
                },
                assignedToId: { 
                    type: "string", 
                    format: "uuid", 
                    nullable: true,
                    description: "References the User assigned to the task",
                },
                dueDate: { 
                    type: "string", 
                    format: "date-time", 
                    nullable: true 
                },
                createdAt: { 
                    type: "string", 
                    format: "date-time" 
                },
                updatedAt: { 
                    type: "string", 
                    format: "date-time" 
                },
                tagId: { 
                    type: "string", 
                    format: "uuid", 
                    nullable: true,
                    description: "References the Tag associated with the task",
                },
            },
        },
        User: {
            type: "object",
            properties: {
                id: { 
                    type: "string", 
                    format: "uuid" 
                },
                firstName: { 
                    type: "string" 
                },
                lastName: { 
                    type: "string" 
                },
                email: { 
                    type: "string" 
                },
                role: { 
                    type: "string", 
                    enum: ["Admin", "Regular"] 
                },
                createdAt: { 
                    type: "string", 
                    format: "date-time" 
                },
                updatedAt: { 
                    type: "string", 
                    format: "date-time" 
                },
                deletedAt: { 
                    type: "string", 
                    format: "date-time", 
                    nullable: true 
                },
            },
            required: ["id", "firstName", "lastName", "email", "role", "createdAt", "updatedAt"],
        },
        Tag: {
            type: "object",
            properties: {
                id: { 
                    type: "string", 
                    format: "uuid" 
                },
                content: { 
                    type: "string" 
                },
                taskId: { 
                    type: "string", 
                    format: "uuid",
                    description: "References the Task associated with this tag",
                },
                createdAt: { 
                    type: "string", 
                    format: "date-time" 
                },
                updatedAt: { 
                    type: "string", 
                    format: "date-time" 
                },
            },
            required: ["id", "content", "taskId", "createdAt", "updatedAt"],
        },
        Comment: { 
            type: "object",
            properties: {
                id: { 
                    type: "string", 
                    format: "uuid" 
                },
                content: { 
                    type: "string" 
                },
                userId: { 
                    type: "string", 
                    format: "uuid",
                    description: "References the User who created the comment",
                },
                taskId: { 
                    type: "string", 
                    format: "uuid",
                    description: "References the Task associated with this comment",
                },
                createdAt: { 
                    type: "string", 
                    format: "date-time" 
                },
                updatedAt: { 
                    type: "string", 
                    format: "date-time" 
                },
            },
            required: ["id", "content", "userId", "taskId", "createdAt", "updatedAt"],
        },
    },
}

const options = {
    swaggerDefinition,
    apis: ["src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;