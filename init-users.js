db.createCollection('users');

db.users.insertOne({
    username: "John",
    password: "passw0rd"
});