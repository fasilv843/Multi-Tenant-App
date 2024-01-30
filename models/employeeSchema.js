import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
    },
    companyName: {
        type: String,
    },
})
export default employeeSchema