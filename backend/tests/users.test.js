const request = require('supertest');
const app = require('../app');
const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll,
        regularToken, adminToken
 } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('POST /', function() { 
    test('backend admin functionality, create new user w/o passed icon file', async function() {
        const test = await request(app).post( 
            '/users'
        ).field(
            {username:'topshelf', password:'abc123abc123', userFirst:'Doug', userLast:'Smith', email:'douglas@aol.com'}
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            user: {
                id: expect.any(Number),
                username:'topshelf',
                userFirst:'Doug',
                userLast:'Smith',
                email:'douglas@aol.com',
                isAdmin:false,
                icon:'defaultUserIcon.jpg'
            },
            token: expect.any(String)
        });
    });

    test('backend admin functionality, create new user w/ passed icon file', async function() {
        const test = await request(app).post(
            '/users'
        ).field(
            {username:'topshelf', password:'abc123abc123', userFirst:'Doug', userLast:'Smith', email:'douglas@aol.com'}
        ).attach(
            'icon', 'tests/generic-white-dude.png'
        ).set(
            "authorization", `Bearer ${adminToken}`
        ).set(
            'Content-Type', 'multipart/form-data'
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            user: {
                id: expect.any(Number),
                username:'topshelf',
                userFirst:'Doug',
                userLast:'Smith',
                email:'douglas@aol.com',
                isAdmin:false,
                icon:'topshelf_userIcon.jpeg'
            },
            token:expect.any(String)
        });
    });

    test("doesn't work: duplicate username value", async function() {
        const test = await request(app).post(
            '/users'
        ).send(
            {username:'admin_test', password:'abc123abc123', userFirst:'Doug', userLast:'Smith', email:'douglas@aol.com', isAdmin:true}
        ).set(
            "authorization", `Bearer ${adminToken}`
        )
            
        expect(test.status).toEqual(400); //BadRequestError
    });
});

describe('POST /register', function() { 
    test('user-generated account creation, create new user w/o passed icon file', async function() {
        const test = await request(app).post( 
            '/users/register'
        ).field(
            {username:'topshelf', password:'abc123abc123', userFirst:'Doug', userLast:'Smith', email:'douglas@aol.com'}
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            user: {
                id: expect.any(Number),
                username:'topshelf',
                userFirst:'Doug',
                userLast:'Smith',
                email:'douglas@aol.com',
                isAdmin:false,
                icon:'defaultUserIcon.jpg'
            },
            token: expect.any(String)
        });
    });

    test('user-generated account creation, create new user w/ passed icon file', async function() {
        const test = await request(app).post(
            '/users/register'
        ).field(
            {username:'topshelf', password:'abc123abc123', userFirst:'Doug', userLast:'Smith', email:'douglas@aol.com'}
        ).attach(
            'icon', 'tests/generic-white-dude.png'
        ).set(
            'Content-Type', 'multipart/form-data'
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            user: {
                id: expect.any(Number),
                username:'topshelf',
                userFirst:'Doug',
                userLast:'Smith',
                email:'douglas@aol.com',
                isAdmin:false,
                icon:'topshelf_userIcon.jpeg'
            },
            token:expect.any(String)
        });
    });

    test("doesn't work: duplicate username value", async function() {
        const test = await request(app).post(
            '/users/register'
        ).send(
            {username:'admin_test', password:'abc123abc123', userFirst:'Doug', userLast:'Smith', email:'douglas@aol.com', isAdmin:true}
        ).set(
            "authorization", `Bearer ${adminToken}`
        )
            
        expect(test.status).toEqual(400); //BadRequestError
    });
});

describe('POST /login', function() {
    test('works, authenticate existing user login attempt', async function() {
        const test = await request(app).post( 
            '/users/login'
        ).send(
            {username:'admin_test', password:'abc123'}
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            user: {
                id: expect.any(Number),
                username:'admin_test',
                userFirst:'mradmin',
                userLast:'theadminuser',
                email:'admin@email.com',
                isAdmin:true,
                icon:'admin_icon.jpg'
            },
            token: expect.any(String)
        });
    });

    test('bad password, authenticate existing user login attempt', async function() {
        const test = await request(app).post( 
            '/users/login'
        ).send(
            {username:'admin_test', password:'wrongpassword'}
        )

        expect(test.status).toEqual(401); //UnauthorizedError

    });

    test('bad username, authenticate existing user login attempt', async function() {
        const test = await request(app).post( 
            '/users/login'
        ).send(
            {username:'idontexist', password:'wrongpassword'}
        )

        expect(test.status).toEqual(400); //BadRequestError

    });
});

describe('POST /feedback', function() {
    test('post feedback!', async function() {
        const test = await request(app).post( 
            '/users/feedback'
        ).send(
            {name:'Any old name', email:'anyoldemail@email.com', feedback:'your site rules!'}
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            feedback: {
                name: 'Any old name',
                email:'anyoldemail@email.com',
                feedback:'your site rules!'
            }
        });
    });
});

describe('GET /', function() {
    test('return all users', async function() {
        const test = await request(app).get(
            '/users'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.statusCode).toBe(200);
        expect(test.body.users).toEqual(expect.arrayContaining([
            {
                id: expect.any(Number),
                username:'admin_test',
                userFirst:'mradmin',
                userLast:'theadminuser',
                email:'admin@email.com',
                isAdmin:true,
                icon:'admin_icon.jpg'
            },
            {
                id: expect.any(Number),
                username:'regular_test',
                userFirst:'mrsuser',
                userLast:'theregularuser',
                email:'regularuser@email.com',
                isAdmin:false,
                icon:'regular_icon.jpg'  
            }
        ]));
    });
});

describe('GET /username/:username', function() {
    test("return user by username", async function() {
        const test = await request(app).get(
            '/users/username/regular_test'
        ).set(
            "authorization", `Bearer ${regularToken}`
        );

        expect(test.body).toEqual(
            {users: {
                id: expect.any(Number),
                username:'regular_test',
                userFirst:'mrsuser',
                userLast:'theregularuser',
                email:'regularuser@email.com',
                isAdmin:false,
                icon:'regular_icon.jpg'
            }
        });
    });

    test('no user matching username', async function() {
        const test = await request(app).get(
            '/users/username/gremlin'
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        expect(test.status).toEqual(404); //NotFoundError
    });

    test('cannot access endpoint unless same user or admin', async function() {
        const test = await request(app).get(
            '/users/username/mradmin'
        ).set(
            "authorization", `Bearer ${regularToken}`
        );
        expect(test.status).toEqual(401); //UnauthorizedError
    });
});

describe('PATCH /:id', function() {
    test('update one or more field values for a user', async function() {
        const test = await request(app).patch(
            '/users/2'
        ).send(
            {userFirst: 'Sarah', userLast:"Smothers", email:'ilovecats@turtles.com'}
        ).set(
            "authorization", `Bearer ${regularToken}`
        );
        expect(test.body).toEqual({
            user: {
                id: expect.any(Number),
                username:'regular_test',
                userFirst:'Sarah',
                userLast:'Smothers',
                email:'ilovecats@turtles.com',
                isAdmin:false,
                icon:'regular_icon.jpg'
            },
            token:expect.any(String)
        });
    });

    test('admin users can update others isAdmin value', async function() {
        const test = await request(app).patch(
            '/users/2'
        ).send(
            {userFirst: 'Sarah', userLast:"Smothers", email:'ilovecats@turtles.com', isAdmin:true}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        expect(test.body).toEqual({
            user: {
                id: expect.any(Number),
                username:'regular_test',
                userFirst:'Sarah',
                userLast:'Smothers',
                email:'ilovecats@turtles.com',
                isAdmin:true,
                icon:'regular_icon.jpg'
            },
            token:expect.any(String)
        });
    });

    test('update with new icon file', async function() {
        const test = await request(app).patch(
            '/users/2'
        ).field(
            {userFirst: 'Sarah', userLast:"Smothers", email:'ilovecats@turtles.com'}
        ).attach(
            'icon', 'tests/generic-white-dude.png'
        ).set(
            "authorization", `Bearer ${regularToken}`
        ).set(
            'Content-Type', 'multipart/form-data'
        )

        expect(test.body).toEqual({
            user: {
                id: expect.any(Number),
                username:'regular_test',
                userFirst:'Sarah',
                userLast:'Smothers',
                email:'ilovecats@turtles.com',
                isAdmin:false,
                icon:'regular_test_userIcon.jpeg'
            },
            token:expect.any(String)
        });
    });

    test('update username', async function() {
        const test = await request(app).patch(
            '/users/2'
        ).send(
            {username:'newusername'}
        ).set(
            "authorization", `Bearer ${regularToken}`
        );
        expect(test.body).toEqual({
            user: {
                id: expect.any(Number),
                username:'newusername',
                userFirst:'mrsuser',
                userLast:'theregularuser',
                email:'regularuser@email.com',
                isAdmin:false,
                icon:'newusername_userIcon.jpeg'
            },
            token:expect.any(String)
        });
    });

    test('id not found', async function() {
        const test = await request(app).patch(
            '/users/99'
        ).send(
            {username:'newusername'}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        expect(test.status).toEqual(404); //NotFoundError
    })
});

describe('DELETE /:id', function() { 
    test('delete an author', async function() {
        const test = await request(app).delete(
            '/users/2'
        ).set(
            "authorization", `Bearer ${regularToken}`
        )
        expect(test.body).toEqual({
            users: {
                id: expect.any(Number),
                username:'regular_test',
                userFirst:'mrsuser',
                userLast:'theregularuser',
                email:'regularuser@email.com',
                isAdmin:false,
                icon:'regular_icon.jpg'
            }
        });

        const getAll = await request(app).get(
            '/users'
        ).set(
            "authorization", `Bearer ${adminToken}`
        );

		expect(getAll.body.users).toEqual(expect.not.arrayContaining([
            {
                id: expect.any(Number),
                username:'regular_test',
                userFirst:'mrsuser',
                userLast:'theregularuser',
                email:'regularuser@email.com',
                isAdmin:false,
                icon:'regular_icon.jpg'
            }
		]));
    });

    test("user not found/bad user id", async function() {
        const test = await request(app).delete(
            '/users/99'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.status).toEqual(404); //NotFoundError
    });
});
