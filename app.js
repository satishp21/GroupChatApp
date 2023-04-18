const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const morgan = require('morgan')

const dotenv = require('dotenv');
dotenv.config();

//database
const sequelize = require('./util/database');
const cors = require('cors'); // Cross-Origin Resource Sharing
//The cors middleware adds the necessary headers to the HTTP response to allow cross-origin requests. By default, the cors middleware allows all origins, headers, and methods, but these can be customized as per the application needs.

//routes
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const chatRoutes = require('./routes/chat');

//models
const User = require('./models/user')
const Chat = require('./models/chats')
const Group = require('./models/group');
const userGroup = require('./models/userGroup');

const app = express();

app.use(express.json());
app.use(cors({
    origin:'*', // any origin is allowed to access resources.
    credentials:true  //allows the server to include cookies and authorization headers in the cross-origin request
}));

app.use(helmet()); //helmet() is a middleware function that helps secure the Express.js application by setting various HTTP headers that can mitigate common security vulnerabilities, such as Cross-Site Scripting (XSS) and Clickjacking.

app.use(morgan()) //morgan() is a middleware function that logs HTTP requests to the console or a file, providing valuable information about the requests being made to the application.

app.use('/user',userRoutes);
app.use(groupRoutes);
app.use(chatRoutes);

//associations
User.hasMany(Chat); //Users primarykey(ie.id) will be stored in chat model
Chat.belongsTo(User);

Group.belongsToMany(User, {through:userGroup}); 
User.belongsToMany(Group, {through: userGroup});
//through option specifies the userGroup model or table that maps the relationship between the two main models(Group and User).

Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(process.env.port);
  })
  .catch(err => {
    console.log(err);
  });