const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: "1.0.0",
        title: " Intelligent Education Management Information System",
        description: "IEMIS, api "
    },
    host: "iemis.herokuapp.com/api/v1",
    basePath: "/",
    schemes: ['http','https'],
    consumes: ['application/json'],
    produces: ['application/json'],

   /*
    tags: [
        {
            "name": "Auth-Admin",
            "description": "Admin Authentication endpoint"
        }
    ],
    securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        },
      
        petstore_auth: {
            type: "oauth2",
            authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
            flow: "implicit",
            scopes: {
                read_pets: "read your pets",
                write_pets: "modify pets in your account"
            }
        }
       
    },
    
    definitions: {
        students:{
            studentId:"023AV",
            schoolCode:"00033",
            firstName:"Ademye",
            middleName:"Akinkunmi",
            lastName:"Alake",
            religion:"Tradition",
            gender:"male",
            dob:"08/09/1641",
            country:"Ghana",
            ethnicity:"Yoruba",
            province:"South-west",
            address:"Ibadan",
            disability:["none"],
            yearAdmission:"02/09/2021",
            presentClass:"Primary One",
            HadEce:"",
            subject: ["Mathematices","English Language","Basic Science", "Social Science","Commercial Study"],
            status:"Active",
            session:"2021/2023",
            father:[{
                name:"Adekunle",
                TIN:"01-3554A",
                address:"Ibadan",
                occupation:"Software Enginner",
                email:"jtalkng@gmail.com",
                phone:["08037358707","08037353323"],
            }],
            mother:[{
                name:"Adekunle",
                TIN:"01-3554A",
                address:"Ibadan",
                occupation:"Project Manager",
                email:"jtalkng@gmail.com",
                phone:["08037358707","08037353323"],
            }],
        },
        school:{
            code:"09935",
            name:"K1 primary School",
            locality:"Abeokuta",
            mailBox:"BOX-2345",
            email:"school@gmail.com",
            phone:"090875645",
            district:"Ibadan",
            created:"03/09/34",
        },
    }

    */
}


const outputFile = './swagger_output.json'
const endpointsFiles = ['../src/app/admin','../src/app/district','../src/app/schools','../src/app/students','../src/app/teacher']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../index')           // Your project's root file
})



