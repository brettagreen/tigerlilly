const request = require('supertest');
const app = require('../app');
const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll,
        regularToken, adminToken
 } = require("./_testCommon");
const Keyword = require("../models/keyword");
const Article = require("../models/article");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('POST /', function() {
    test('works, create new article(s)-keyword association', async function() {
        const test = await request(app).post(
            '/keywords'
        ).send(
            JSON.stringify({articleId:1, keywords:["unsightly", "amusing"]})
        ).set(
            "authorization", `Bearer ${adminToken}`
        ).set(
            'Content-Type', 'application/json' 
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            keywords: {
                articleTitle:'First test article',
                keywords:["unsightly", "amusing"]
            }
        });

        const keywords = await Keyword.getArticleKeywords(1);
        expect(keywords).toEqual(expect.arrayContaining([
            {keyword:'funny'},
            {keyword:'excellent'},
            {keyword:'groaner'},
            {keyword:'unsightly'},
            {keyword:'amusing'}
        ]));
    });

    test('works, associate keyword(s) with all articles', async function() {
        const test = await request(app).post(
            '/keywords'
        ).send(
            JSON.stringify({articleId:0, keywords:["unsightly", "amusing"]})
        ).set(
            "authorization", `Bearer ${adminToken}`
        ).set(
            'Content-Type', 'application/json' 
        )

        expect(test.status).toEqual(201);
        expect(test.body).toEqual({
            keywords: {
                articleTitle:'All Articles',
                keywords:["unsightly", "amusing"]
            }
        });

        const keywords = await Keyword.getKeywords();
        expect(keywords).toEqual(expect.arrayContaining([
			{keyword:'funny', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'funny', articleId: expect.any(Number), articleTitle:'Second test article'},
            {keyword:'excellent', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'groaner', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'improper', articleId: expect.any(Number), articleTitle:'Second test article'},
            {keyword:'unsightly', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'unsightly', articleId: expect.any(Number), articleTitle:'Second test article'},
            {keyword:'amusing', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'amusing', articleId: expect.any(Number), articleTitle:'Second test article'}
            
        ]));
    });

    test("doesn't work, article id does not exist", async function() {
        const test = await request(app).post(
            '/keywords'
        ).send(
            JSON.stringify({articleId:99, keywords:["unsightly", "amusing"]})
        ).set(
            "authorization", `Bearer ${adminToken}`
        ).set(
            'Content-Type', 'application/json' 
        )

        expect(test.status).toEqual(404); //NotFoundError
    });

    test("doesn't work, article-keyword association already exists", async function() {
        const test = await request(app).post(
            '/keywords'
        ).send(
            JSON.stringify({articleId:1, keywords:["funny"]})
        ).set(
            "authorization", `Bearer ${adminToken}`
        ).set(
            'Content-Type', 'application/json' 
        )

        expect(test.status).toEqual(400); //BadRequestError
    });
});

describe('GET /', function() { 
    test('return all article-keyword associations', async function() {
        const test = await request(app).get(
            '/keywords'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.statusCode).toBe(200);
        expect(test.body.keywords).toEqual(expect.arrayContaining([
			{keyword:'funny', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'funny', articleId: expect.any(Number), articleTitle:'Second test article'},
            {keyword:'excellent', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'groaner', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'improper', articleId: expect.any(Number), articleTitle:'Second test article'}
            
        ]));
    });
});

describe('GET /:articleId', function() {
    test("return keyword associations for specific article", async function() {

        const test = await request(app).get(
            '/keywords/1'
        );

        expect(test.body.keywords).toEqual(expect.arrayContaining([
            {keyword:'funny'},
            {keyword:'excellent'},
            {keyword:'groaner'}
        ]));
    });

    test("oopsie! no article with that id", async function() {

        const test = await request(app).get(
            '/keywords/99'
        );

        expect(test.status).toEqual(404); //NotFoundError
    });

    test("oopsie! no keywords associated with that article id", async function() {

        const newArticle = await Article.create({articleTitle:"newish article", authorId:1, text:"testing123", issueId:1});
        const test = await request(app).get(
            `/keywords/${newArticle.id}`
        );

        expect(test.status).toEqual(404); //NotFoundError
    });
});


describe('PATCH /:articleId', function() {
    test('update keyword val for specific article-keyword association', async function() {
        const test = await request(app).patch(
            '/keywords/1'
        ).send(
            {keyword: 'funny', edit:'funniest'}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        expect(test.body).toEqual({
            updateKeywords: {
                articleTitle: 'First test article', keyword:'funniest'
            }
        });

        const keywords = await Keyword.getArticleKeywords(1)
        expect(keywords).toEqual(expect.arrayContaining([
			{keyword:'funniest'},
            {keyword:'excellent'},
            {keyword:'groaner'}
        ]));
    });

    test('update keyword val across all articles', async function() {
        const test = await request(app).patch(
            '/keywords/0'
        ).send(
            {keyword: 'funny', edit:'funniest'}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );
        expect(test.body).toEqual({
            updateKeywords: {
                articleTitle: 'All Articles', keyword:'funniest'
            }
        });

        const keywords = await Keyword.getKeywords();
        expect(keywords).toEqual(expect.arrayContaining([
			{keyword:'funniest', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'funniest', articleId: expect.any(Number), articleTitle:'Second test article'},
            {keyword:'excellent', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'groaner', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'improper', articleId: expect.any(Number), articleTitle:'Second test article'}
            
        ]));
    });

    test("aritcle id doesn't exist", async function() {
        const test = await request(app).patch(
            '/keywords/99'
        ).send(
            {keyword: 'funny', edit:'funniest'}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );

        expect(test.status).toEqual(404); //NotFoundError
    });

    test("keyword val doesn't exist", async function() {
        const test = await request(app).patch(
            '/keywords/0'
        ).send(
            {keyword: 'pricier', edit:'priciest'}
        ).set(
            "authorization", `Bearer ${adminToken}`
        );

        expect(test.status).toEqual(404); //NotFoundError
    });
});

describe('DELETE /:articleId/:keyword', function() { 
    test('delete an article-keyword association', async function() {
        const test = await request(app).delete(
            '/keywords/1/funny'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )
        expect(test.body.deleteKeywords).toEqual(
            {
                articleTitle:'First test article',
                keyword:'funny'
            }
        );
    });

    test("delete keyword across all articles", async function() {
        const test = await request(app).delete(
            '/keywords/0/funny'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.body.deleteKeywords).toEqual(
            {
                articleTitle:'All Articles',
                keyword:'funny'
            }
        );
    });

    test("article id doesn't exist", async function() {
        const test = await request(app).delete(
            '/keywords/99/funny'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.status).toEqual(404); //NotFoundError

    });

    test("keyword doesn't exist", async function() {
        const test = await request(app).delete(
            '/keywords/0/derpy'
        ).set(
            "authorization", `Bearer ${adminToken}`
        )

        expect(test.status).toEqual(404); //NotFoundError

    });
});
