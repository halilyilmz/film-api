import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync(new URL("../../package.json", import.meta.url)));
const version = packageJson.version;


const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Rest film api Docs",
            version
        },
        servers:[
            {
                url:"http://localhost:3002/api"
            }
        ],
        components: {
            securitySchemes: {
              BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
            },
          },
          security: [
            {
              BearerAuth: [],
            },
          ],
},
    apis:["./src/controllers/*.js"]
}

export const swaggerDoc = swaggerJSDoc(options)