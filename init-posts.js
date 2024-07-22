db.createCollection('posts');

db.posts.insertMany([
{   
    Author: "John",
    Body: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
},
{
    Author: "John",
    Body: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
},
{
    uthor: "John",
    Body: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
},
{
    Author: "John",
    Body: "4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
    
},
{
    Author: "John",
    Body: "5",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
    
},
{
    Author: "John",
    Body: "6",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
    
}]);

