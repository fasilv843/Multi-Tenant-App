import mongoose from 'mongoose'

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  companyName: {
    type: String,
    unique: true,
  },
})

export default tenantSchema