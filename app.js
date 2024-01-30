import employeeSchema from "./models/employeeSchema.js";
import tenantSchema from "./models/tenantSchema.js";
import { connectDB } from "./services/mongo.connect.js";

const companySchemas = new Map([['employee', employeeSchema]])
const tenantSchemas = new Map([['tenant', tenantSchema]])

const switchDB = async (dbName, dbSchema) => {
    const mongoose = await connectDB()
    if (mongoose.connection.readyState === 1) {
        const db = mongoose.connection.useDb(dbName, { useCache: true })

        console.log(db.models, 'db.models from app');
        
        if (!Object.keys(db.models).length) {
            dbSchema.forEach((schema, modelName) => {
                db.model(modelName, schema)
            });
        }

        return db
    }
    throw new Error('error from switchDB')
}

const getDbModel =async (db, modelName) => {
    return db.model(modelName)
}

const initTenants = async () => {
    const tenantDB = await switchDB('AppTenants', tenantSchemas)
    const tenant = await getDbModel(tenantDB, 'tenant')
    await tenant.deleteMany({})
    const tenantA = await tenant.create({
        name: 'Steve',
        email: 'Steve@example.com',
        password: 'secret',
        companyName: 'Apple',
    })
    const tenantB = await tenant.create({
        name: 'Bill',
        email: 'Bill@example.com',
        password: 'secret',
        companyName: 'Microsoft',
    })
    const tenantC = await tenant.create({
        name: 'Jeff',
        email: 'Jeff@example.com',
        password: 'secret',
        companyName: 'Amazon',
    })
}

const initEmployees = async () => {
    const customers = await getAllTenants()
    const createEmployees = customers.map(async (tenant) => {
        const companyDB = await switchDB(tenant.companyName, companySchemas)
        const employeeModel = await getDbModel(companyDB, 'employee')
        await employeeModel.deleteMany({})
        return employeeModel.create({
            employeeId: Math.floor(Math.random() * 10000).toString(),
            name: 'John',
            companyName: tenant.companyName
        })
    })
    const results = await Promise.all(createEmployees)
}

const getAllTenants = async () => {
    const tenantDB = await switchDB('AppTenants', tenantSchemas)
    const tenantModel = await getDbModel(tenantDB, 'tenant')
    const tenants = tenantModel.find({})
    return tenants
}

//list of employees for each companies database
const listAllEmployees = async () => {
    const customers = await getAllTenants()
    const mapCustomers = customers.map(async (tenant) => {
        const companyDB = await switchDB(tenant.companyName, companySchemas)
        const employeeModel = await getDbModel(companyDB, 'employee')
        return employeeModel.find({})
    })
    const results = await Promise.all(mapCustomers)
    return results
}

(async function run() {
    await initTenants()
    await initEmployees()
    const tenants = await getAllTenants()
    const employees = await listAllEmployees()

    console.log(tenants, 'tenants from run IIFE');
    console.log(employees, 'employees from run IIFE');
})()