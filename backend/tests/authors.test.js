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
    test('works, create new author w/o passed icon file', async function() {
        const test = await request(app).post(
            '/authors'
        ).field(
            {authorFirst:'Douglas', authorLast:'McDingus', authorHandle:'dingleberry', authorSlogan:'i like turtles',
                authorBio:'i was born under mysterious circumstances'}
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            authors: {
                id: expect.any(Number),
                author:'Douglas McDingus',
                authorFirst:'Douglas',
                authorLast:'McDingus',
                authorHandle:'dingleberry',
                authorSlogan:'i like turtles',
                authorBio:'i was born under mysterious circumstances',
                icon:'defaultUserIcon.jpg'
            }
        });
    });

    //add an 's' to the end of every field cos i'm super clever
    test('works, create new author w/ passed icon file', async function() {
        const test = await request(app).post(
            '/authors'
        ).field(
            {authorFirst:'Douglass', authorLast:'McDinguss', authorHandle:'dingleberrys', authorSlogan:'i like turtless',
                authorBio:'i was born under mysterious circumstancess'}
        ).attach(
            'icon', 'tests/generic-white-dude.png'
        ).set(
            "authorization", `Bearer ${adminToken}`
        ).set(
            'Content-Type', 'multipart/form-data'
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            authors: {
                id: expect.any(Number),
                author:'Douglass McDinguss',
                authorFirst:'Douglass',
                authorLast:'McDinguss',
                authorHandle:'dingleberrys',
                authorSlogan:'i like turtless',
                authorBio:'i was born under mysterious circumstancess',
                icon:'dingleberrys_authorIcon.jpeg'
            }
        });
    });

    test("doesn't work: schema violation(s)", async function() {
        const test = await request(app).post(
            '/authors'
        ).send(
            {authorFirst:55, authorLast:true, authorHandle:{}, authorSlogan:'i like turtles',
                authorBio:'i am inhuman. my datatypes are also...55true{}[]newSet()etc'}
        ).set(
            "authorization", `Bearer ${adminToken}`
        )
            
        console.log("ERROR MSG?", test.text);
        expect(test.status).toEqual(400); //BadRequestError
    });
});

describe('GET /', function() {
    test('return all authors', async function() {
        const test = await request(app).get(
            '/authors'
        );

        expect(test.statusCode).toBe(200);
        expect(test.body.authors).toEqual(expect.arrayContaining([
            {
                id: expect.any(Number),
                author:'Jon Johnson',
                authorFirst:'Jon',
                authorLast:'Johnson',
                authorHandle:'thejohnsonator',
                authorSlogan:'where is the beef?',
                authorBio:'veni vidi vici',
                icon:'jonauthor.jpg'
            },
            {
                id: expect.any(Number),
                author:'Destiny Wilson',
                authorFirst:'Destiny',
                authorLast:'Wilson',
                authorHandle:'futureperfect',
                authorSlogan:'no comment',
                authorBio:'small town girl',
                icon:'destinyauthor.jpg'   
            }
        ]));
    });
});

describe('GET /authorHandle/:authorHandle', function() {
    test("return author by author handle", async function() {
        const test = await request(app).get('/authors/authorHandle/futureperfect');
        expect(test.body).toEqual(
            {authors: {
                author:'Destiny Wilson',
                authorFirst:'Destiny',
                authorLast:'Wilson',
                authorHandle:'futureperfect',
                authorSlogan:'no comment',
                authorBio:'small town girl',
                icon:'destinyauthor.jpg'   
            }
        });
    });

    test('no authors matching author handle', async function() {
        const test = await request(app).get('/authors/authorHandle/bojangles');
        expect(test.status).toEqual(404); //NotFoundError
    });
});


describe('PATCH /:id', function() {
    test('update one or more field values for an author', async function() {
        const test = await request(app).patch(
            '/authors/1'
        ).send(
            {authorFirst: 'REGINALD', authorLast:"BLOOMBERRY", authorSlogan:'i like to change my name'}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        expect(test.body).toEqual({
            authors: {
                author:'REGINALD BLOOMBERRY',
                authorFirst:'REGINALD',
                authorLast:'BLOOMBERRY',
                authorHandle:'thejohnsonator',
                authorSlogan:'i like to change my name',
                authorBio:'veni vidi vici',
                icon:'jonauthor.jpg'
            }
        });
    });

    test("doesn't work: schema violation(s)", async function() {
        const test = await request(app).patch(
            '/authors/1'
        ).send(
            {authorFirst: []}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
    
        expect(test.status).toEqual(400); //BadRequestError
    });
});

describe('DELETE /:id', function() { 
    test('delete an author', async function() {
        const test = await request(app).delete(
            '/authors/1'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )
        expect(test.body).toEqual({
            authors: {
                author:'Jon Johnson',
                authorFirst:'Jon',
                authorLast:'Johnson',
                authorHandle:'thejohnsonator',
                authorSlogan:'where is the beef?',
                authorBio:'veni vidi vici',
                icon:'jonauthor.jpg'
            }
        });

        const getAll = await request(app).get(
            '/authors'
        ).set(
            "authorization", `Bearer ${adminToken}`
        );

		expect(getAll.body.authors).toEqual(expect.not.arrayContaining([
            {
                id: expect.any(Number),
                author:'Jon Johnson',
                authorFirst:'Jon',
                authorLast:'Johnson',
                authorHandle:'thejohnsonator',
                authorSlogan:'where is the beef?',
                authorBio:'veni vidi vici',
                icon:'jonauthor.jpg'
            }
		]));
    });

    test("author not found/bad author id", async function() {
        const test = await request(app).delete(
            '/authors/99'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.status).toEqual(404); //NotFoundError
    });
});
