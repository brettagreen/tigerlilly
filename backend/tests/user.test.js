"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const User = require("../models/user");
const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**
 * create user
 */
describe("create/register new user", function () {
    test("works", async function () {
      	const user = await User.register({username:'iambaby', password:'googoogaga', userFirst:'gerber', userLast:'jones',
                                email:'smol@child.com', isAdmin:false }, 'user_baby.jpg');
      	expect(user).toEqual({id:expect.any(Number), username:'iambaby', userFirst:'gerber', userLast:'jones', email:'smol@child.com',
                                isAdmin:false, icon:'user_baby.jpg'});
    });

    test("works, w/ default values", async function() {
        const user = await User.register({username:'iambaby', password:'googoogaga', userFirst:'gerber', userLast:'jones',
                                email:'smol@child.com'});
        expect(user).toEqual({id:expect.any(Number), username:'iambaby', userFirst:'gerber', userLast:'jones', email:'smol@child.com',
                                isAdmin:false, icon:'defaultUserIcon.jpg'});
    });

    test("doesn't work, duplicate", async function () {
        try {
            await User.register({username:'regular_test', password:'whatever', userFirst:'stankey', userLast:'jones',
                                email:'heehaw@aklsdjf.com'});
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.message).toEqual(expect.stringMatching('Duplicate username and/or email value. try again'));        
        }
    });
});

/**
 * authenticate user.
 */
describe("authenticate user", function () {
    test("works", async function () {
      	const user = await User.authenticate({username:'admin_test', password:'abc123'});
      	expect(user).toEqual({id:expect.any(Number), userFirst:'mradmin', userLast:'theadminuser', email:'admin@email.com',
                                username:'admin_test', isAdmin:true, icon:'admin_icon.jpg'});
    });

    test("doesn't work, bad username", async function () {
        try {
            await User.authenticate({username:'elmotheclown', password:'abc123'});
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.message).toEqual(expect.stringMatching('that username does not exist: elmotheclown'));        
        }
    });

    test("doesn't work, bad password", async function () {
        try {
            await User.authenticate({username:'admin_test', password:'skillsets'});
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
            expect(err.message).toEqual(expect.stringMatching('bad password'));        
        }
    });
});

/**
 * register user feedback
 */
describe("save user feedback to database", function () {
    test("works", async function () {
      	const feedback = await User.feedback({name:'brett', email:'brett@brett.biz', feedback:'awesome site, perfect!'});
      	expect(feedback).toEqual({name:'brett', email:'brett@brett.biz', feedback:'awesome site, perfect!'});
    });
});

/** 
 * get all users
 */
describe("get all users", function () {
    test("works", async function () {
		const users = await User.findAll();
		expect(users).toEqual(expect.arrayContaining([
			{id:expect.any(Number), username:'admin_test', userFirst:'mradmin', userLast:'theadminuser', email:'admin@email.com',
                isAdmin:true, icon:'admin_icon.jpg'},
            {id:expect.any(Number), username:'regular_test', userFirst:'mrsuser', userLast:'theregularuser', email:'regularuser@email.com',
                isAdmin:false, icon:'regular_icon.jpg'}		
        ]));
	});
});

/** 
 * get user by username
 */
describe("get by username", function () {
    test("works", async function () {
		const user = await User.get('regular_test');
		expect(user).toEqual(
            {id:expect.any(Number), username:'regular_test', userFirst:'mrsuser', userLast:'theregularuser', email:'regularuser@email.com',
                isAdmin:false, icon:'regular_icon.jpg'}		
        );
	});

    test("doesn't work, bad username", async function() {
        try {
            await User.get("madeupusername");
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
            expect(err.message).toEqual(expect.stringMatching('no user found by that username: madeupusername'));  
        }
    });
});

/** 
 * get username value based on user id
 */
describe("get username by id", function () {
    test("works", async function () {
		const username = await User.getUsername(1);
		expect(username).toEqual('admin_test');
	});

    test("doesn't work, bad id value", async function() {
        try {
            await User.getUsername(99);
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
            expect(err.message).toEqual(expect.stringMatching('no user found by that id: 99'));  
        }
    });
});

/**
 * update a user
 */
describe("update a user", function() {
	test("works, w/o pw update", async function() {
        const body = {userFirst:'Denny', userLast:'Driver'};
		const user = await User.update(1, body, 'new_icon_name.jpg');
		expect(user).toEqual(
			{id:expect.any(Number), userFirst:'Denny', userLast:'Driver', email:'admin@email.com', username:'admin_test',
                isAdmin:true, icon:'new_icon_name.jpg'}
		);
	});

	test("works, w/ pw update. then authenticate", async function() {
        const newPassword = 'appleCherryPie';
        const body = {password: newPassword};
		const user = await User.update(1, body);
		expect(user).toEqual(
			{id:expect.any(Number), userFirst:'mradmin', userLast:'theadminuser', email:'admin@email.com', username:'admin_test',
                isAdmin:true, icon:'admin_icon.jpg'}		
        );
    
        const login = await User.authenticate({username:'admin_test', password: newPassword});
        expect(login).toEqual(
			{id:expect.any(Number), userFirst:'mradmin', userLast:'theadminuser', email:'admin@email.com', username:'admin_test',
                isAdmin:true, icon:'admin_icon.jpg'}
        );
	});

    test("doesn't work, bad user id", async function() {
		try {
			await User.update(99, {userFirst:'charlie', email:'charlie@charles.com'});
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`no user found by that id: 99`))
		}
    });

});

/**
 * delete a user {id, username, userFirst, userLast, email, isAdmin, icon}
 */
describe("delete a user", function () {
    test("works", async function () {
		const deletedUser = await User.remove(2);
		expect(deletedUser).toEqual(
            {id:expect.any(Number), username:'regular_test', userFirst:'mrsuser', userLast:'theregularuser', email:'regularuser@email.com',
                isAdmin:false, icon:'regular_icon.jpg'}	
		);

		const allUsers = await User.findAll();
		expect(allUsers).toEqual(expect.not.arrayContaining([
            {id:expect.any(Number), username:'regular_test', userFirst:'mrsuser', userLast:'theregularuser', email:'regularuser@email.com',
                isAdmin:false, icon:'regular_icon.jpg'}
		]));
	});

    test("doesn't work, no user matching passed id", async function () {

		try {
			await User.remove(99);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`no user found by that id: 99`))
		}
    });
});

