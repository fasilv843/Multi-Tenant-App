import { IEmployee, employeeSchema } from "./models/employeeSchema.js";
import { ITenant, tenantSchema } from "./models/tenantSchema.js";
import { connectDB } from "./services/mongo.connect.js";
import { Model, Mongoose, Schema } from 'mongoose'; // Import Mongoose explicitly


interface ITenantSchema extends Schema<ITenant & Document> { }
interface IEmployeeSchema extends Schema<IEmployee & Document> { }

// Models and collections in AppTenants Database apply here
const companySchemas = new Map<string, IEmployeeSchema>([
  ['employee', employeeSchema as unknown as IEmployeeSchema]
]);

// Models or Collections that is in Company Database apply here
const tenantSchemas = new Map<string, ITenantSchema>([
  ['tenant', tenantSchema as unknown as ITenantSchema]
]);

// Returns database with name 'dbName'
async function switchDB(dbName: string, dbSchema: Map<string, any>): Promise<typeof mongoose> {
  const mongoose = await connectDB();

  if (mongoose.connection.readyState === 1) {
    const db = mongoose.connection.useDb(dbName, { useCache: true });

    console.log(db.models, 'db.models from switchDB');
    console.log(Object.keys(db.models).length, 'db.models length');
    
    if (!Object.keys(db.models).length) {
      dbSchema.forEach((schema, modelName) => {
        console.log(modelName, 'modelName from switchDB');
        // initialize model or collection with name 'modelName' and schema as structure
        db.model(modelName, schema);
      });
    }

    return db as unknown as typeof mongoose
  }

  throw new Error('error from switchDB');
}

// returns a model (Collection) from passed database
async function getDbModel<T>(db: Mongoose, modelName: string): Promise<Model<T>> {
  return db.model<T>(modelName);
}

// Creates tenants in AppTenants Database
async function initTenants() {
  const tenantDB = await switchDB('AppTenants', tenantSchemas);
  const TenantModel = await getDbModel<ITenantSchema>(tenantDB, 'tenant')

  // Deleting all previously saved tenants
  await TenantModel.deleteMany({})

  await TenantModel.create({
    name: 'Steve',
    email: 'Steve@example.com',
    password: 'secret',
    companyName: 'Apple',
  });
  await TenantModel.create({
    name: 'Bill',
    email: 'Bill@example.com',
    password: 'secret',
    companyName: 'Microsoft',
  })
  await TenantModel.create({
    name: 'Jeff',
    email: 'Jeff@example.com',
    password: 'secret',
    companyName: 'Amazon',
  })
}

// Return All Tenants from AppTenants Database
const getAllTenants = async () => {
  const tenantDB = await switchDB('AppTenants', tenantSchemas)
  const tenantModel = await getDbModel(tenantDB, 'tenant')
  const tenants = tenantModel.find({}) as unknown as ITenant[]
  // console.log(tenants, 'tenants from getAllTenants');
  return tenants
}

// Creates database for each company based on tenant company name
async function initEmployees(): Promise<void> {
  const customers = await getAllTenants(); // Assuming getAllTenants returns a Promise<Tenant[]>

  const createEmployees = customers.map(async (tenant): Promise<IEmployee> => {
    const companyDB = await switchDB(tenant.companyName, companySchemas);
    const EmployeeModel = await getDbModel<IEmployee>(companyDB, 'employee');
    // deleting previously saved data from each company collection
    await EmployeeModel.deleteMany({});

    return EmployeeModel.create({
      employeeId: Math.floor(Math.random() * 10000).toString(),
      name: tenant.name,
      companyName: tenant.companyName,
    });
  });

  await Promise.all(createEmployees);
}

// Returns Employees in each company
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

// Starting function
async function run() {
  await initTenants();
  await initEmployees();
  const tenants = await getAllTenants();
  const employees = await listAllEmployees();

  console.log(tenants, 'tenants from run IIFE');
  console.log(employees, 'employees from run IIFE');
}

run();
