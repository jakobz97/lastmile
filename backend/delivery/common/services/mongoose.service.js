const config = require('../../common/config/env.config.js');
const mongoose = require('mongoose');
let count = 0;

const options = {
    // all other approaches are now deprecated by MongoDB:
    useNewUrlParser: true,
    useUnifiedTopology: true

};
const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(`mongodb+srv://${config.db_user}:${config.db_password}@${config.db_link}/${config.db_name}?retryWrites=true&w=majority`, options).then(()=>{
        console.log('MongoDB is connected')
    }).catch(err=>{
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 2000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;







