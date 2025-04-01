const fs = require("fs");
const path = require("path");
const _ = require("lodash");
require("dotenv").config();

const swagger = {
  openapi: "3.0.0",
  info: {
    title: `${process.env.APP_NAME} API`,
    version: process.env.APP_VERSION,
    description: `API documentation for ${process.env.APP_NAME} features`,
  },
  servers: [
    {
      url: `${process.env.HOST}/api`,
      description: `${process.env.NODE_ENV} server`,
    },
  ],
  tags: [
    { name: "Auth", description: "Auth management" },
    { name: "User", description: "User management" },
    { name: "Feature", description: "Feature management" },
    { name: "Bucket", description: "Bucket management" },
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        operationId: "loginUser",
        summary: "Login user",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                },
                example: {
                  username: "test@gmail.com",
                  password: "1234",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/auth/github-login": {
      post: {
        tags: ["Auth"],
        operationId: "loginWithGithub",
        summary: "Login user with github",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: {
                    type: "string",
                  },
                },
                example: {
                  code: "CodeFromGithub",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/auth/google-login": {
      post: {
        tags: ["Auth"],
        operationId: "loginWithGoogle",
        summary: "Login user with google",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                },
                example: {
                  username: "test@gmail.com",
                  password: "1234",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        operationId: "signupUser",
        summary: "Signup user",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                },
                example: {
                  username: "test@gmail.com",
                  password: "1234",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/user": {
      get: {
        tags: ["User"],
        operationId: "getAllUsers",
        summary: "Get all user",
        parameters: [],
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      post: {
        tags: ["User"],
        operationId: "createUser",
        summary: "Create new user",
        parameters: [],
        requestBody: {
          $ref: "#components/requestBodies/User",
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/user/{uid}": {
      get: {
        tags: ["User"],
        operationId: "getUserById",
        summary: "Get user detail by id",
        parameters: [
          {
            in: "path",
            name: "uid",
            description: "user id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      put: {
        tags: ["User"],
        operationId: "updateUser",
        summary: "Update user detail by id",
        parameters: [
          {
            in: "path",
            name: "uid",
            description: "user id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          $ref: "#/components/requestBodies/User",
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/user/resetPassword": {
      post: {
        tags: ["User"],
        operationId: "reserPasswordByUsername",
        summary: "Reset user password",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                },
                example: {
                  username: "test@gmail.com",
                  password: "123456",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/user/search": {
      post: {
        tags: ["User"],
        operationId: "searchUsers",
        summary: "Search users",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fid: {
                    type: "number",
                  },
                  attributes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  statusFilter: {
                    type: "string",
                  },
                  exUids: {
                    type: "array",
                    items: {
                      type: "number",
                    },
                  },
                  searchString: {
                    type: "string",
                  },
                  limit: {
                    type: "number",
                  },
                },
                example: {
                  fid: 1,
                  attributes: [],
                  statusFilter: "Active",
                  exUids: [],
                  searchString: "@emory",
                  limit: 10,
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/feature": {
      get: {
        tags: ["Feature"],
        operationId: "getAllFeatures",
        summary: "Get all features",
        parameters: [],
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      post: {
        summary: "Create new feature",
        tags: ["Feature"],
        operationId: "createFeature",
        parameters: [],
        requestBody: {
          $ref: "#/components/requestBodies/Feature",
          description: "Create feature object",
          required: true,
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/feature/{fid}": {
      get: {
        summary: "Get feature by feature id",
        tags: ["Feature"],
        operationId: "getFeatureById",
        parameters: [
          {
            in: "path",
            name: "fid",
            description: "feature id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      put: {
        summary: "Update feature detail by feature id",
        tags: ["Feature"],
        operationId: "updateFeatureById",
        parameters: [
          {
            in: "path",
            name: "fid",
            description: "feature id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          $ref: "#/components/requestBodies/Feature",
          description: "Create feature object",
          required: true,
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      delete: {
        summary: "Delete feature detail by feature id",
        tags: ["Feature"],
        operationId: "deleteFeatureById",
        parameters: [
          {
            in: "path",
            name: "fid",
            description: "feature id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/feature/{fid}/users": {
      get: {
        summary: "Get specific feature users",
        tags: ["Feature"],
        operationId: "getAllFeatureUsers",
        parameters: [
          {
            in: "path",
            name: "fid",
            description: "feature id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
        },
      },
      post: {
        tags: ["Feature"],
        operationId: "createFeatureUser",
        summary: "Create feature user detail",
        parameters: [
          {
            in: "path",
            name: "fid",
            description: "feature id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          $ref: "#/components/requestBodies/cadaProjectUser",
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/feature/{fid}/users/{uid}": {
      get: {
        tags: ["Feature"],
        operationId: "getFeatureUserByUserId",
        summary: "Get feature user detail by id",
        parameters: [
          {
            in: "path",
            name: "fid",
            description: "feature id",
            required: true,
            schema: {
              type: "integer",
            },
          },
          {
            in: "path",
            name: "uid",
            description: "user id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      put: {
        tags: ["Feature"],
        operationId: "updateFeatureUserByUserId",
        summary: "Update feature user detail by id",
        parameters: [
          {
            in: "path",
            name: "fid",
            description: "feature id",
            required: true,
            schema: {
              type: "integer",
            },
          },
          {
            in: "path",
            name: "uid",
            description: "user id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  role: {
                    type: "string",
                    default: "user",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      delete: {
        tags: ["Feature"],
        operationId: "deleteFeatureUserById",
        summary: "Delete feature user detail",
        parameters: [
          {
            in: "path",
            name: "fid",
            description: "feature id",
            required: true,
            schema: {
              type: "integer",
            },
          },
          {
            in: "path",
            name: "uid",
            description: "user id",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/bucket": {
      get: {
        tags: ["Bucket"],
        operationId: "getAllBuckets",
        summary: "Retrieve root files/folders from S3 ",
        parameters: [],
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/bucket/{path}": {
      get: {
        tags: ["Bucket"],
        operationId: "getBucketByPath",
        summary: "Retrieve files/folders by specified S3 path",
        parameters: [
          {
            in: "path",
            name: "path",
            schema: {
              type: "string",
            },
            required: true,
            description: "The path to retrieve files from S3 buckets",
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      user: {
        type: "object",
        required: ["id", "username"],
        properties: {
          id: {
            type: "integer",
          },
          username: {
            type: "string",
            default: "test@gmail.com",
          },
          email: {
            type: "string",
            default: "test@gmail.com",
          },
          password: {
            type: "string",
            default: "1234",
          },
          loginType: {
            type: "string",
            description: "Login type",
            enum: ["local", "github", "google"],
          },
          firstName: {
            type: "string",
            default: "Tom",
          },
          lastName: {
            type: "string",
            default: "Tom",
          },
          avatar: {
            type: "string",
            default: "",
          },
          token: {
            type: "string",
            default: "",
          },
          IsBot: {
            type: "boolean",
            default: false,
          },
        },
      },
      feature: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
            default: "App name",
          },
          description: {
            type: "string",
            default: "App description",
          },
        },
      },
      featureUser: {
        type: "object",
        required: ["id", "role", "userId", "featureId"],
        properties: {
          id: {
            type: "integer",
          },
          role: {
            type: "string",
            description: "role type",
            enum: ["user", "admin"],
          },
          userId: {
            type: "integer",
          },
          featureId: {
            type: "integer",
          },
          status: {
            type: "string",
            default: "Active",
          },
        },
      },
    },
    responses: {
      UserArray: {
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                  },
                  name: {
                    type: "string",
                    default: "Tom Jerry",
                  },
                  email: {
                    type: "string",
                    default: "test@gmail.com",
                  },
                  loginType: {
                    type: "string",
                    description: "Login type",
                    enum: ["local", "github", "google"],
                  },
                  Token: {
                    type: "string",
                    default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                  },
                  WantsEmail: {
                    type: "boolean",
                    default: false,
                  },
                  IsBot: {
                    type: "boolean",
                    default: false,
                  },
                  cadaProjectUser: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/cadaProjectUser",
                    },
                  },
                  FeatureUser: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/featureUser",
                    },
                  },
                },
              },
            },
          },
        },
        description: "List of user object",
      },
      FeatureArray: {
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                $ref: "#/components/schemas/feature",
              },
            },
          },
        },
        description: "List of feature object",
      },
      FeatureUserArray: {
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                $ref: "#/components/schemas/featureUser",
              },
            },
          },
        },
        description: "List of feature user object",
      },
    },
    requestBodies: {
      "User": {
        "content": {
          "application/json": {
            "schema": {
              "example": {
                "name": "Del Bold",
                "email": "test@gmail.com",
                "loginType": "saml",
                "isBot": false,
                "role": "user"
              }
            }
          }
        }
      },
      "Feature": {
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "id",
                "name"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "default": "App name"
                },
                "description": {
                  "type": "string",
                  "default": "App description"
                }
              }
            }
          }
        }
      }
    }
  },
};

const loadFeatures = () => {
  const featureFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".json") && file !== "index.js");

  for (const file of featureFiles) {
    const filePath = path.join(__dirname, file);
    const featureData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (featureData.tags) swagger.tags.push(...featureData.tags);
    if (featureData.paths) _.merge(swagger.paths, featureData.paths);
    if (featureData.components?.schemas)
      _.merge(swagger.components.schemas, featureData.components.schemas);
    if (featureData.components?.responses)
      _.merge(swagger.components.responses, featureData.components.responses);
    if (featureData.components?.requestBodies)
      _.merge(swagger.components.requestBodies, featureData.components.request
    );
  }

  return swagger;
};

module.exports = loadFeatures();
