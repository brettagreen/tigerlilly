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
    test('works, create new article as admin', async function() {
        const test = await request(app).post(
                '/articles'
            ).send(
                {articleTitle: 'gooberz & goblinz', authorId:1, text:'spooky scary stuff', issueId:1}
            ).set(
                "authorization", `Bearer ${adminToken}`
            );

        expect(test.status).toEqual(201);
        
        expect(test.body).toEqual({
            articles: {
                id: expect.any(Number),
                articleTitle:'gooberz & goblinz',
                authorFirst:'Jon',
                authorLast:'Johnson',
                authorHandle:'thejohnsonator',
                authorId:1,
                text:'spooky scary stuff',
                issueTitle:'Primary Test Issue',
                issueId:1
            }
        });
    });

    test("doesn't work: create new article as non-admin", async function() {
        const test = await request(app).post(
                '/articles'
            ).send(
                {articleTitle: 'gooberz & goblinz', authorId:1, text:'spooky scary stuff', issueId:1}
            ).set(
                "authorization", `Bearer ${regularToken}`
            );
    
        expect(test.status).toEqual(401);
    });

    test("doesn't work: schema violation(s)", async function() {
        const test = await request(app).post(
            '/articles'
        ).send(
            {articleTitle: 'gooberz & goblinz', authorId:"bonanza", text:false, issueId:"1"}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
    
        expect(test.status).toEqual(400); //BadRequestError
    });
});

describe('GET /', function() {
    test('return all articles', async function() {
        //admin only
        const test = await request(app).get(
            '/articles'
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        expect(test.statusCode).toBe(200);
        expect(test.body).toEqual({ "articles": [
            {id: expect.any(Number), articleTitle:'First test article', authorFirst:'Jon', authorLast:'Johnson', authorId:1,
                text:'gobble gobble!', issueTitle:'Primary Test Issue', issueId:1},
            {id: expect.any(Number), articleTitle:'Second test article', authorFirst:'Destiny', authorLast:'Wilson', authorId:2,
                text:'funny stuff. ipsum lorem.', issueTitle:'Primary Test Issue', issueId:1}
        ]});
    });
});

describe('GET /:id', function() {
    test('return article by article id', async function() {
        const test = await request(app).get('/articles/1');
        expect(test.body).toEqual(
            {articles:
                {articleId: expect.any(Number), articleTitle:'First test article', authorFirst:'Jon', authorLast:'Johnson',
                    authorHandle:'thejohnsonator', text:'gobble gobble!', issueId:1, issueTitle:'Primary Test Issue',
                     pubDate:expect.any(String)}
        });
    });

    test('no article by that article id', async function() {
        const test = await request(app).get('/articles/99');
        expect(test.status).toEqual(404); //NotFoundError
    });
});

describe('GET /articleTitle/:articleTitle', function() {
    test("return article by article's title", async function() {
        const test = await request(app).get('/articles/articleTitle/Second%20test%20article');
        expect(test.body).toEqual(
            {articles:
                {articleTitle:'Second test article', authorFirst:'Destiny', authorLast:'Wilson',
                    text:'funny stuff. ipsum lorem.', issueTitle:'Primary Test Issue'}
        });
    });

    test('no article by that title', async function() {
        const test = await request(app).get('/articles/articleTitle/peanutbutter');
        expect(test.status).toEqual(404); //NotFoundError
    });
});

describe('GET /authors/:handle', function() {
    test("return all articles matching the author's handle", async function() {
        const test = await request(app).get('/articles/authors/futureperfect');
        expect(test.body).toEqual(
            {articles:
                [
                    {articleId:expect.any(Number), articleTitle:'Second test article', authorFirst:'Destiny', authorLast:'Wilson',
                    authorHandle:'futureperfect', text:'funny stuff. ipsum lorem.', issueId:1, issueTitle:'Primary Test Issue',
                    pubDate:expect.any(String)}
                ]
        });
    });

    test('no articles matching author handle', async function() {
        const test = await request(app).get('/articles/authors/bojangles');
        expect(test.status).toEqual(404); //NotFoundError
    });
});

describe('GET /keywords/:keyword', function() {
    test("return all articles matching the keyword/hashtag in either the text or title", async function() {
        const test = await request(app).get('/articles/keywords/funny');
        expect(test.body).toEqual(
            {articles:
                [
                    {articleId:expect.any(Number), articleTitle:'First test article', authorFirst:'Jon', authorLast:'Johnson',
                    authorHandle:'thejohnsonator', text:'gobble gobble!', issueId:1},

                    {articleId:expect.any(Number), articleTitle:'Second test article', authorFirst:'Destiny', authorLast:'Wilson',
                    authorHandle:'futureperfect', text:'funny stuff. ipsum lorem.', issueId:1}
                ]
        });
    });

    test('no keyword-article associations', async function() {
        const test = await request(app).get('/articles/keywords/scandalous');
        expect(test.status).toEqual(404); //NotFoundError
    });
});

describe('GET /search/:kwds', function() {
    test("return all articles that contain any of the passed keywords in either the text or title", async function() {
        const test = await request(app).get('/articles/search/gobble,ipsum');
        expect(test.body).toEqual(
            {results:
                [
                    {articleId:expect.any(Number), articleTitle:'First test article', authorFirst:'Jon', authorLast:'Johnson',
                        authorHandle:'thejohnsonator', text:'gobble gobble!', issueId:1, issueTitle:'Primary Test Issue',
                        pubDate:expect.any(String)},

                    {articleId:expect.any(Number), articleTitle:'Second test article', authorFirst:'Destiny', authorLast:'Wilson',
                        authorHandle:'futureperfect', text:'funny stuff. ipsum lorem.', issueId:1, issueTitle:'Primary Test Issue', 
                        pubDate:expect.any(String)}
                ]
        });
    });

    test("return all articles that contain any of the passed hashtags in either the text or title", async function() {
        const test = await request(app).get('/articles/search/*funny');
        expect(test.body).toEqual(
            {results:
                [
                    {articleId:expect.any(Number), articleTitle:'First test article', authorFirst:'Jon', authorLast:'Johnson',
                    authorHandle:'thejohnsonator', text:'gobble gobble!', issueId:1, issueTitle:'Primary Test Issue',
                    pubDate:expect.any(String)},

                    {articleId:expect.any(Number), articleTitle:'Second test article', authorFirst:'Destiny', authorLast:'Wilson',
                    authorHandle:'futureperfect', text:'funny stuff. ipsum lorem.', issueId:1, issueTitle:'Primary Test Issue',
                    pubDate:expect.any(String)}
                ]
        });
    });

    test('empty search results', async function() {
        const test = await request(app).get('/articles/search/failure');
        expect(test.body).toEqual(
            {results: []}
        );
    });
});

describe('PATCH /:id', function() {
    test('update one or more field values for an article', async function() {
        const test = await request(app).patch(
            '/articles/1'
        ).send(
            {articleTitle: 'Hilarious Article', authorId:2, text:'hahaha', issueId:1}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        expect(test.body).toEqual({
            articles: {
                articleTitle:'Hilarious Article',
                author:'Destiny Wilson',
                authorHandle:'futureperfect',
                text:'hahaha',
                issueTitle:'Primary Test Issue'
            }
        });
    });

    test("doesn't work: update article as non-admin", async function() {
        const test = await request(app).patch(
                '/articles/1'
            ).send(
                {articleTitle: 'gooberz & goblinz', authorId:1, text:'spooky scary stuff', issueId:1}
            ).set(
                "authorization", `Bearer ${regularToken}`
            );
    
        expect(test.status).toEqual(401);
    });

    test("doesn't work: schema violation(s)", async function() {
        const test = await request(app).patch(
            '/articles/1'
        ).send(
            {articleTitle: 'gooberz & goblinz', authorId:"bonanza", text:false, issueId:"1"}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
    
        expect(test.status).toEqual(400); //BadRequestError
    });
});

describe('DELETE /:id', function() {
    test('delete an article', async function() {
        const test = await request(app).delete(
            '/articles/1'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )
        expect(test.body).toEqual({
            articles: {
                articleTitle:'First test article',
                author:'Jon Johnson',
                authorHandle:'thejohnsonator',
                text:'gobble gobble!',
                issueTitle:'Primary Test Issue'
            }
        });

        const getAll = await request(app).get(
            '/articles'
        ).set(
            "authorization", `Bearer ${adminToken}`
        );

		expect(getAll.body.articles).toEqual(expect.not.arrayContaining([
            {id: expect.any(Number), articleTitle:'First test article', authorFirst:'Jon', authorLast:'Johnson', authorId:1,
                text:'gobble gobble!', issueTitle:'Primary Test Issue', issueId:1}
		]));
    });

    test("article not found/bad article id", async function() {
        const test = await request(app).delete(
            '/articles/99'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.status).toEqual(404); //NotFoundError
    });
});
