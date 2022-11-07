const { 
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getUserByUserId,
    getPostsByUser,
    createTags,
    createPostTag,
    getPostById,
    addTagsToPost,
    getPostsByTagName
} = require("./index");

async function dropTables() {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
            DROP TABLE IF EXISTS post_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!")
        throw error;
    }
};

async function createTables() {
    try {
        console.log("Starting to build tables...");
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
            );
            CREATE TABLE tags (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
            CREATE TABLE post_tags (
                "postId" INTEGER REFERENCES posts(id),
                "tagId" INTEGER REFERENCES tags(id),
                UNIQUE ("postId", "tagId")
            );
        `);
        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!")
        throw error;
    }
};

async function createInitialUsers() {
    try {
        console.log("Starting to create users...")
        await createUser({ username: 'albert', password: 'bertie99', name: "Albert", location: "USA"});
        await createUser({ username: 'sandra', password: '2sandy4me', name: "Sandra", location: "Brazil" });
        await createUser({ username: 'glamgal', password: 'soglam', name: "Bob", location: "Swaziland" });

        console.log("Done creating users!")
    } catch(error) {
        console.error("Error creating users!")
        throw error;
    }
}

async function createInitialPosts() {
    try {
        const [albert, sandra, glamgal] = await getAllUsers();
        console.log("Creating posts!")

        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "Just setting up my twitter!",
            tags: ["#wow", "#woah"]
        });
        await createPost({
            authorId: sandra.id,
            title: "Second Post",
            content: "I hate albert!",
            tags: ["#hater", "#opp"]
        });
        console.log("Finished creating posts!");
    } catch (error) {
        console.log("Error creating posts!")
        throw error
    }
};

  

async function reBuildDB() {
    try {
        client.connect();
        
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (error) {
        throw error;
    } 
};

async function testDB() {
    try {
        console.log("Starting to test database...");

        const users = await getAllUsers();
        console.log("getAllUsers: ", users);

        
        console.log("Updating user on user[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname",
            location: "Bulgaria"
        });
        console.log("Update user result: ", updateUserResult);

        const posts = await getAllPosts();
        console.log("All posts result: ", posts);

        const updatePostResult = await updatePost(posts[0].id, {
            title: "New Title",
            content: "Updated Content"
          });
          console.log("Update post result:", updatePostResult);

          const albert = await getUserByUserId(1);
          console.log("Get user by id result: ", albert);


        console.log("Finished database tests!");
    } catch (error) {
        console.error("Error testing database!");
        throw error;
    } 
};


reBuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());