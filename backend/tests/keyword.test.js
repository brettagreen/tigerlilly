"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const Keyword = require("../models/keyword");
const Article = require("../models/article");
const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**
 * create article-keyword association for specific article
 */
describe("create new article-keyword association(s)", function () {
    test("works", async function () {
      	const association = await Keyword.addToArticle({articleId:2, keywords:['newKeyword', 'newestKeyword']});
      	expect(association).toEqual({articleTitle:'Second test article', keywords:['newKeyword', 'newestKeyword']});

        const allArticleKeywords = await Keyword.getArticleKeywords(2);
        expect(allArticleKeywords).toEqual(expect.arrayContaining([{keyword:'newKeyword'}, {keyword:'newestKeyword'}]));
    });

    test("not found/no such article id", async function() {
        try {
            await Keyword.addToArticle({articleId:99, keywords:['googoogaga']});
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
            expect(err.message).toEqual(expect.stringMatching('no article found by that id: 99'));
        }
    });

    test("article-keyword association already exists", async function () {
        try {
            await Keyword.addToArticle({articleId:2, keywords:['funny']});
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.message).toEqual(expect.stringMatching('article-keyword association already exists: funny-2'));        }
    });

});

/**
 * create article-keyword association for all articles
 */
describe("create new article-keyword association(s)", function () {
    test("works", async function () {
      	const association = await Keyword.addToAllArticles(['newKeyword', 'newestKeyword']);
      	expect(association).toEqual({articleTitle:'All Articles', keywords:['newKeyword', 'newestKeyword']});

        const allArticleKeywords = await Keyword.getArticleKeywords(2);
        expect(allArticleKeywords).toEqual(expect.arrayContaining([{keyword:'newKeyword'}, {keyword:'newestKeyword'}]));
    });

    test("article-keyword association already exists. ignores error if association already exists", async function () {
        const association = await Keyword.addToAllArticles(['funny']);
        expect(association).toEqual({articleTitle:'All Articles', keywords:['funny']});
    });

});

/** 
 * get all (distinct) keywords across all articles, along with articleId and articleTitle
 */
describe("get all keyword-article associations", function () {
    test("works", async function () {
		const keywords = await Keyword.getKeywords();
		expect(keywords).toEqual(expect.arrayContaining([
			{keyword:'funny', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'funny', articleId: expect.any(Number), articleTitle:'Second test article'},
            {keyword:'excellent', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'groaner', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'improper', articleId: expect.any(Number), articleTitle:'Second test article'}
		]));
	});
});

/**
 * get article keywords based on article id
 */
describe("get keywords by article id", function () {
    test("works", async function () {
		const keywords = await Keyword.getArticleKeywords(1);
		expect(keywords).toEqual(expect.arrayContaining([
			{keyword:'funny'},
            {keyword:'excellent'},
            {keyword:'groaner'}
		]));
	});

    test("works, article w/o keywords", async function () {
        await Article.create({articleTitle:'Third test article', authorId:2, text:'waves', issueId:1});
		try {
			await Keyword.getArticleKeywords(3);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`no keywords are associated with that article id: 3`))
		}
	});

    test("not found/no article by that id", async function () {
		try {
			await Keyword.getArticleKeywords(99);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`no article found by that id: 99`))
		}
    });
});

/**
 * return all (unique) article ids containing search keyword(s).
 * positive results =  Set([ids...]) negative results = empty Set()
 */
describe("fetch by search", function () {
    test("works", async function () {
		const articleIds = await Keyword.search(['funny']);
		expect(articleIds).toEqual(new Set([1,2]));
	});

    test("not found/no articles matching search", async function () {
		const articleIds = await Keyword.search(['dingleberry']);
		expect(articleIds).toEqual(new Set());
    });
});

/**
 * update a keyword value
 */
describe("update a keyword specific to an article", function() {
	test("works", async function() {
		const keyword = await Keyword.updateKeywords(2, {keyword:'funny', edit:'funniest'});
		expect(keyword).toEqual(
			{articleTitle:'Second test article', keyword:'funniest'}
		);
		const keywords = await Keyword.getArticleKeywords(2);
		expect(keywords).toEqual(expect.arrayContaining([
			{keyword:'funniest'},
            {keyword:'improper'}
		]));
	});

	test("update a keyword across all articles", async function() {
		const keyword = await Keyword.updateKeywords(0, {keyword:'funny', edit:'funniest'});
		expect(keyword).toEqual(
			{articleTitle:'All Articles', keyword:'funniest'}
		);
		const keywords = await Keyword.getKeywords();
		expect(keywords).toEqual(expect.arrayContaining([
			{keyword:'funniest', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'funniest', articleId: expect.any(Number), articleTitle:'Second test article'}
		]));
        expect(keywords).toEqual(expect.not.arrayContaining([
            {keyword:'funny', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'funny', articleId: expect.any(Number), articleTitle:'Second test article'}
        ]));
	});

    test("article id doesn't exist", async function() {
		try {
			await Keyword.updateKeywords(99, {keyword:'funny', edit:'funniest'});
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`no article found by that id: 99`))
		}
    });

    test("keyword val doesn't exist", async function() {
		try {
			await Keyword.updateKeywords(2, {keyword:'hubris', edit:'calamity'});
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`that keyword doesn't exist: hubris`))
		}
    });

});

/**
 * delete a keyword
 */
describe("delete a keyword", function () {
    test("works on one article", async function () {
		const deletion = await Keyword.delete(1, 'funny');
		expect(deletion).toEqual(
			{articleTitle:'First test article', keyword: 'funny'}
		);
		const keywords = await Keyword.getArticleKeywords(1);
		expect(keywords).toEqual(expect.arrayContaining([
            {keyword:'excellent'},
            {keyword:'groaner'}
		]));
        expect(keywords).toEqual(expect.not.arrayContaining([
			{keyword:'funny'}
        ]));
	});

	test("works on all articles", async function () {
		const deletion = await Keyword.delete(0, 'funny');
		expect(deletion).toEqual(
			{articleTitle:'All Articles', keyword: 'funny'}
		);
		const keywords = await Keyword.getKeywords();
		expect(keywords).toEqual(expect.arrayContaining([
            {keyword:'excellent', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'groaner', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'improper', articleId: expect.any(Number), articleTitle:'Second test article'}
		]));
        expect(keywords).toEqual(expect.not.arrayContaining([
			{keyword:'funny', articleId: expect.any(Number), articleTitle:'First test article'},
            {keyword:'funny', articleId: expect.any(Number), articleTitle:'Second test article'}
        ]));
	});

    test("not found/no article matching passed id", async function () {

		try {
			await Keyword.delete(99, 'funny');
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`no article found by that id: 99`))
		}
    });
});

