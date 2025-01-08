


export interface SwaggerRoute {
    [key: string]: {
      [method: string]: {
        tags: string[];
        summary: string;
        description?: string;
        security?: Array<{ [key: string]: string[] }>;
        requestBody?: any;
        parameters?: any[];
        responses: {
          [statusCode: string]: {
            description: string;
            content?: any;
          };
        };
      };
    };
  }
  
  // src/docs/swagger/schemas.ts
  export const schemas = {
    Task: {
      type: 'object',
      required: ['title'],
      properties: {
        id: {
          type: 'string',
          description: 'Auto-generated task ID'
        },
        title: {
          type: 'string',
          description: 'Task title'
        },
        description: {
          type: 'string',
          description: 'Detailed task description'
        },
        completed: {
          type: 'boolean',
          description: 'Task completion status',
          default: false
        }
      }
    },
    User: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: {
          type: 'string',
          description: 'Auto-generated user ID'
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email address'
        },
        password: {
          type: 'string',
          description: 'User password'
        },
        name: {
          type: 'string',
          description: 'User full name'
        }
      }
    }
  } as const;
  
  
  export const authRoutes = {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Create a new user account in the system',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User successfully registered',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      $ref: '#/components/schemas/User'
                    },
                    token: {
                      type: 'string',
                      description: 'JWT token'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid data or user already exists'
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        description: 'Authenticate an existing user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email'
                  },
                  password: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Successful login',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      description: 'JWT token'
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Invalid credentials'
          }
        }
      }
    }
  };
  
  // src/docs/swagger/task.routes.ts
  
  export const taskRoute: SwaggerRoute = {
    '/tasks': {
      post: {
        tags: ['Tasks'],
        summary: 'Create a new task',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Task'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Task created successfully'
          },
          401: {
            description: 'Unauthorized - Invalid token'
          }
        }
      },
      get: {
        tags: ['Tasks'],
        summary: 'Get all tasks',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of tasks',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Task'
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid token'
          }
        }
      }
    }
  };
  
  
  export const swaggerDocs = {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'Task management API with authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    paths: {
      ...authRoutes,
      ...taskRoute
    }
  } as const;