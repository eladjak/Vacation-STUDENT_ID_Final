"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const User_1 = require("../entities/User");
async function checkUsers() {
    try {
        await data_source_1.AppDataSource.initialize();
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        console.log('Checking users in database...');
        const users = await userRepository.find();
        if (users.length === 0) {
            console.log('No users found in database');
        }
        else {
            console.log(`Found ${users.length} users:`);
            users.forEach(user => {
                console.log(`
Email: ${user.email}
Role: ${user.role}
Password Hash: ${user.password}
Created At: ${user.createdAt}
        `);
            });
        }
    }
    catch (error) {
        console.error('Error checking users:', error);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
    }
}
checkUsers();
//# sourceMappingURL=checkUsers.js.map