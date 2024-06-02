const mongoose = require('mongoose');


const roleSchema = new mongoose.Schema({
    IsAdmin: { type: Boolean, required: true },
});
  
const Role = mongoose.model('Role', roleSchema, "roles");

module.exports = Role;