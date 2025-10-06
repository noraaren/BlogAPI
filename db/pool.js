const {Pool} = require("pg");
require("dotenv").config()

module.exports = new Pool({
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGDATABASE: process.env.PGDATABASE,
    PGPORT: process.env.PGPORT,
})

