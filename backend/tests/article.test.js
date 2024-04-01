"use strict";

const { NotFoundError } = require("../expressError");
const Article = require("../models/article");
const Keyword = require("../models/keyword");
const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**
 * create article
 */
describe("create new article", function () {
    test("works", async function () {
      	const article = await Article.create({articleTitle:'new test article', authorId:1, text:'test article text', issueId:1 });
      	expect(article).toEqual({id: expect.any(Number), articleTitle:'new test article', authorFirst:'Jon', authorLast:'Johnson', 
			authorHandle:'thejohnsonator', authorId:1, text:'test article text', issueTitle:'Primary Test Issue', issueId:1});
    });

    test("duplicate already exists", async function () {
		try {
			await Article.create({articleTitle:'First test article', authorId:1, text:'gobble gobble!', issueId:1 });
		} catch (err) {
			expect(err.message).toEqual(expect.stringMatching('duplicate entry: this article already exists'));
		}

    });
});

/**
 * get all articles
 */
describe("get all articles", function () {
    test("works", async function () {
		const articles = await Article.getAll();

		expect(articles).toEqual([
			{id:1, articleTitle:'First test article', authorFirst:'Jon', authorLast:'Johnson', authorId:1, text:'gobble gobble!',
				issueTitle:'Primary Test Issue', issueId:1},
			{id:2, articleTitle:'Second test article', authorFirst:'Destiny', authorLast:'Wilson', authorId:2,
				text:'funny stuff. ipsum lorem.', issueTitle:'Primary Test Issue', issueId:1 }
		]);
    });
});

/** 
 * get article by article id
 */
describe("get by article id", function () {
    test("works", async function () {
		const article = await Article.get(2);
		expect(article).toEqual(
			{articleId: expect.any(Number), articleTitle:'Second test article', authorFirst:'Destiny', authorLast:'Wilson', authorHandle:'futureperfect',
			 	text:'funny stuff. ipsum lorem.', issueId:1, issueTitle:'Primary Test Issue', pubDate: expect.any(Date) }
		);
	});

    test("not found/no such id", async function () {
		try {
			await Article.get(55);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No article found by that id: 55`))
		}
    });
});

/**
 * get article by article title
 */
describe("get by article title", function () {
    test("works", async function () {
		const article = await Article.getByArticleTitle('First test article');
		expect(article).toEqual(
			{articleTitle:'First test article', authorFirst:'Jon', authorLast:'Johnson', text:'gobble gobble!',
				issueTitle:'Primary Test Issue'}
		);
	});

    test("not found/no such title", async function () {
		try {
			await Article.getByArticleTitle('Clown Spectacle')
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No article found by that title: Clown Spectacle`))
		}
    });
});

/**
 * get all articles by specific author (using author's handle)
 */
describe("get articles by author handle", function () {
	/**
	 */
    // test("works", async function () {
	// 	//push new article. 'today' variable captures date of operation
	// 	await Article.create({articleTitle:'newest test article', authorId:1, text:'so new and shiny', issueId:2 });
	// 	 const allArticles = await Article.getAll();
	// 	 console.log('allarticles', allArticles);
	// 	const articles = await Article.fetchByAuthor('thejohnsonator');
	// 	articles[0].pubDate = articles[0].pubDate.toISOString().substring(0, 10);
	// 	articles[1].pubDate = articles[1].pubDate.toISOString().substring(0, 10);
	// 	const today = articles[1].pubDate;

	// 	expect(articles).toEqual(expect.arrayContaining([
	// 		{articleId: 5, articleTitle:'newest test article', authorFirst:'Jon', authorHandle:'thejohnsonator', authorLast:'Johnson',
	// 		text:'so new and shiny', issueId:2, issueTitle:'Second Test Issue', pubDate: today},
	// 		{articleId: 1, articleTitle:'First test article', authorFirst:'Jon', authorHandle:'thejohnsonator',authorLast:'Johnson',
	// 			 text:'gobble gobble!', issueId:1, issueTitle:'Primary Test Issue', pubDate: '2024-01-01'}

	// 	]));
	// });

    test("not found/no such author", async function () {
		try {
			await Article.fetchByAuthor('disgracedjournalist');
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No articles found by that author handle: disgracedjournalist`))
		}
    });
});

/**
 * return all articles that contain specified keyword
 * [{articleId, articleTitle, authorFirst, authorLast, authorHandle, text, issueId}, ...]
 */
describe("fetch by keyword", function () {
    test("works", async function () {
		const articles = await Article.fetchByKeyword('funny');
		expect(articles).toEqual([
			{articleId:1, articleTitle:'First test article', authorFirst:'Jon', authorLast:'Johnson', authorHandle:'thejohnsonator',
			 	text:'gobble gobble!', issueId:1},
			{articleId:2, articleTitle:'Second test article', authorFirst:'Destiny', authorLast:'Wilson', authorHandle:'futureperfect',
			 	text:'funny stuff. ipsum lorem.', issueId:1}
		]);
	});

    test("not found/no articles matching keyword", async function () {
		try {
			await Article.fetchByKeyword('catastrophe')
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No articles found associated with that keyword: catastrophe`))
		}
    });
});

/**
 * return all (unique) article ids containing search term(s) somewhere in its text or title.
 * positive results =  Set([ids...]) negative results = empty Set()
 */
describe("fetch by search", function () {
    test("works", async function () {
		const articleIds = await Article.search(['first', 'funny stuff']);
		expect(articleIds).toEqual(new Set([1,2]));
	});

    test("not found/no articles matching search", async function () {
		const articleIds = await Article.search(['adios muchachos']);
		expect(articleIds).toEqual(new Set());
    });
});

/**
 * update an article. all article fields can be modified.
 */
describe("update article", function () {
    test("works", async function () {
		const body = {articleTitle: 'updated article title', text: 'updated article text'}
		const article = await Article.update(1, body)
		expect(article).toEqual(
			{articleTitle:'updated article title', author:'Jon Johnson', authorHandle:'thejohnsonator', text:'updated article text',
				issueTitle:'Primary Test Issue'}
		);
	});

	test("works with no and/or redundant updates passed", async function () {
		const body = {articleTitle: 'Second test article'}
		const article = await Article.update(2, body)
		expect(article).toEqual(
			{articleTitle:'Second test article', author:'Destiny Wilson', authorHandle:'futureperfect', text:'funny stuff. ipsum lorem.',
				issueTitle:'Primary Test Issue'}
		);
	});

    test("not found/no article matching passed id", async function () {

		try {
			const body = {articleTitle: 'Second test article'}
			await Article.update(834, body);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No article found by that id: 834`))
		}
    });
});


/**
 * delete an article
 */
describe("delete article", function () {
    test("works", async function () {
		const article = await Article.delete(1);
		expect(article).toEqual(
			{articleTitle:'First test article', author:'Jon Johnson', authorHandle:'thejohnsonator', text:'gobble gobble!',
				issueTitle:'Primary Test Issue'}
		);
	});

	test("article's keywords are deleted when article is deleted", async function() {
		const keywords = await Keyword.getArticleKeywords(2);
		expect(keywords).toEqual([
			{keyword:'funny'},
			{keyword:'improper'}
		]);
		await Article.delete(2);
		try {
			await Keyword.getArticleKeywords(2);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`no article found by that id: 2`))
		}

	});

    test("not found/no article matching passed id", async function () {
		try {
			await Article.delete(49);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No article found by that id: 49`));
		}
    });
});

