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
    test('works, create new issue', async function() {
        const test = await request(app).post(
            '/issues'
        ).send(
            {issueTitle:'omg new issue', volume:2, issue:1}
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            issues: {
                id: expect.any(Number),
                issueTitle:'omg new issue',
                volume:2,
                issue:1,
                pubDate:expect.any(String)
            }
        });
    });

    test("doesn't work: schema violation(s)", async function() {
        const test = await request(app).post(
            '/issues'
        ).send(
            {issueTitle:'another new issue', volume:200, issue:1} //volume number > 100
        ).set(
            "authorization", `Bearer ${adminToken}`
        )
            
        console.log("ERROR MSG?", test.text);
        expect(test.status).toEqual(400); //BadRequestError
    });
});

describe('GET /', function() { 
    test('return all issues', async function() {
        const test = await request(app).get(
            '/issues'
        );

        expect(test.statusCode).toBe(200);
        expect(test.body.issues).toEqual(expect.arrayContaining([
            {
                id:expect.any(Number),
                issueTitle:'Primary Test Issue',
                volume:1,
                issue:1,
                pubDate:expect.any(String)
            },
            {
                id:expect.any(Number),
                issueTitle:'Second Test Issue',
                volume:1,
                issue:2,
                pubDate:expect.any(String)  
            }
        ]));
    });
});

describe('GET /currentIssue', function() {
    test("return most recently published issue and its articles", async function() {

        //let's put some articles in this issue first
        await request(app).post(
            '/articles'
        ).send(
            {articleTitle: 'gooberz & goblinz', authorId:1, text:'spooky scary stuff', issueId:2}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );

        await request(app).post(
            '/articles'
        ).send(
            {articleTitle: 'grass fed beef!', authorId:2, text:'super good and stuff', issueId:2}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );

        const test = await request(app).get('/issues/currentIssue');

        expect(test.body.issues).toEqual(expect.arrayContaining([
            {
                issueTitle:'Second Test Issue',
                volume:1,
                issue:2,
                pubDate:expect.any(String),
                articleId:expect.any(Number),
                articleTitle:'gooberz & goblinz',
                text:'spooky scary stuff',
                authorFirst:'Jon',
                authorLast:'Johnson',
                authorHandle:'thejohnsonator'
            },
            {
                issueTitle:'Second Test Issue',
                volume:1,
                issue:2,
                pubDate:expect.any(String),
                articleId:expect.any(Number),
                articleTitle:'grass fed beef!',
                text:'super good and stuff',
                authorFirst:'Destiny',
                authorLast:'Wilson',
                authorHandle:'futureperfect'              
            }
        ]));
    });
});

describe('GET /:id', function() {
    test("return issue info and its articles per passed issue id", async function() {

        const test = await request(app).get('/issues/1');

        expect(test.body.issues).toEqual(expect.arrayContaining([
            {
                issueTitle:'Primary Test Issue',
                volume:1,
                issue:1,
                pubDate:expect.any(String),
                articleId:expect.any(Number),
                articleTitle:'First test article',
                text:'gobble gobble!',
                authorFirst:'Jon',
                authorLast:'Johnson',
                authorHandle:'thejohnsonator'
            },
            {
                issueTitle:'Primary Test Issue',
                volume:1,
                issue:1,
                pubDate:expect.any(String),
                articleId:expect.any(Number),
                articleTitle:'Second test article',
                text:'funny stuff. ipsum lorem.',
                authorFirst:'Destiny',
                authorLast:'Wilson',
                authorHandle:'futureperfect'              
            }
        ]));
    });
});

describe('GET /issueTitle/:issueTitle', function() {
    test("return issue info and its articles per passed issue's title", async function() {

        const test = await request(app).get('/issues/issueTitle/Primary%20Test%20Issue');

        expect(test.body.issues).toEqual(expect.arrayContaining([
            {
                issueTitle:'Primary Test Issue',
                volume:1,
                issue:1,
                pubDate:expect.any(String),
                articleId:expect.any(Number),
                articleTitle:'First test article',
                text:'gobble gobble!',
                authorFirst:'Jon',
                authorLast:'Johnson',
                authorHandle:'thejohnsonator'
            },
            {
                issueTitle:'Primary Test Issue',
                volume:1,
                issue:1,
                pubDate:expect.any(String),
                articleId:expect.any(Number),
                articleTitle:'Second test article',
                text:'funny stuff. ipsum lorem.',
                authorFirst:'Destiny',
                authorLast:'Wilson',
                authorHandle:'futureperfect'              
            }
        ]));
    });

    test("bad article title value, not found", async function() {
        const test = await request(app).get('/issues/issueTitle/DingoAteMyBaby');

        expect(test.status).toEqual(404);
    });
});

describe('PATCH /:id', function() {
    test('update one or more field values for an issue', async function() {
        const test = await request(app).patch(
            '/issues/1'
        ).send(
            {issueTitle: 'burptastic', volume: 50}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        expect(test.body).toEqual({
            issues: {
                issueTitle: 'burptastic', volume:50, issue:1, pubDate:expect.any(String)
            }
        });
    });

    test("issue id doesn't exist, bad id", async function() {
        const test = await request(app).patch(
            '/issues/11'
        ).send(
            {issueTitle: 'burptastic', volume: 50}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
    
        expect(test.status).toEqual(404); //NotFoundError
    });
});

describe('DELETE /:id', function() { 
    test('delete an issue', async function() {
        const test = await request(app).delete(
            '/issues/1'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )
        expect(test.body.issues).toEqual(
            {
                issueTitle:'Primary Test Issue',
                volume:1,
                issue:1,
                pubDate:expect.any(String)
            }
        );

        const getAll = await request(app).get(
            '/issues'
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        
		expect(getAll.body.issues).toEqual([
            {
                id:expect.any(Number),
                issueTitle:'Second Test Issue',
                volume:1,
                issue:2,
                pubDate:expect.any(String)  
            }
		]);
    });

    test("issue not found/bad issue id", async function() {
        const test = await request(app).delete(
            '/issues/99'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.status).toEqual(404); //NotFoundError
    });
});
