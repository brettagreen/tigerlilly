"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const Issue = require("../models/issue");
const Article = require("../models/article");
const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**
 * create issue
 */
describe("create new issue", function () {
    test("works", async function () {
        const pushBody = { issueTitle: 'hell on wheels', volume: 1, issue: 3 }
      	const issue = await Issue.create(pushBody);
        const respBody = {id: expect.any(Number), issueTitle: 'hell on wheels', volume: 1, issue: 3,
                            pubDate: expect.any(Date)}
      	expect(issue).toEqual(respBody);
    });

    test("duplicate already exists", async function () {
        try {
            const body = {issueTitle: 'de novo', volume: 1, issue: 3 }
            await Issue.create(body);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.message).toEqual(expect.stringMatching('duplicate entry: this issue already exists'));
        }
    });

});

/**
 * get all issues
 */
describe("get all issues", function () {
    test("works", async function () {
		const issues = await Issue.getAll();

		expect(issues).toEqual([
			{id: expect.any(Number), issueTitle:'Primary Test Issue', volume:1, issue:1, pubDate: expect.any(Date)},
			{id: expect.any(Number), issueTitle:'Second Test Issue', volume:1, issue:2, pubDate: expect.any(Date)}
		]);
    });
});

/** 
 * get issue - and all of its article/author info - by id
 */
describe("get issue by id", function () {
    test("works, issue w/ articles", async function () {
		const issue = await Issue.get(1);
		expect(issue).toEqual([
			{issueTitle:'Primary Test Issue', volume:1, issue:1, pubDate: expect.any(Date), articleId: expect.any(Number),
				articleTitle:'First test article', text:'gobble gobble!', authorFirst:'Jon', authorLast:'Johnson',
				 authorHandle:'thejohnsonator'},
			{issueTitle:'Primary Test Issue', volume:1, issue:1, pubDate: expect.any(Date), articleId: expect.any(Number),
				 articleTitle:'Second test article', text:'funny stuff. ipsum lorem.', authorFirst:'Destiny', authorLast:'Wilson',
				  authorHandle:'futureperfect'}
		]);
	});

    test("works, issue w/o articles", async function () {
		const issue = await Issue.get(2);
		expect(issue).toEqual([
			{issueTitle:'Second Test Issue', volume:1, issue:2, pubDate: expect.any(Date), articleId: null,
				articleTitle: null, text: null, authorFirst: null, authorLast: null,
				 authorHandle: null}
		]);
	});

    test("not found/no such id", async function () {
		try {
			await Issue.get(99);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No issue found by that id: 99`))
		}
    });
});

/**
 * get issue - and all of its article/author info - by issue's title
 */
describe("get issue by title", function () {
    test("works, issue w/ articles", async function () {
		const issue = await Issue.getByTitle('Primary Test Issue');
		expect(issue).toEqual([
			{issueTitle:'Primary Test Issue', volume:1, issue:1, pubDate: expect.any(Date), articleId: expect.any(Number),
				articleTitle:'First test article', text:'gobble gobble!', authorFirst:'Jon', authorLast:'Johnson',
				 authorHandle:'thejohnsonator'},
			{issueTitle:'Primary Test Issue', volume:1, issue:1, pubDate: expect.any(Date), articleId: expect.any(Number),
				 articleTitle:'Second test article', text:'funny stuff. ipsum lorem.', authorFirst:'Destiny', authorLast:'Wilson',
				  authorHandle:'futureperfect'}
		]);
	});

    test("works, issue w/o articles", async function () {
		const issue = await Issue.getByTitle('Second Test Issue');
		expect(issue).toEqual([
			{issueTitle:'Second Test Issue', volume:1, issue:2, pubDate: expect.any(Date), articleId: null,
				articleTitle: null, text: null, authorFirst: null, authorLast: null,
				 authorHandle: null}
		]);
	});

    test("not found/no issue by that title", async function () {
		try {
			await Issue.getByTitle('buuuurrrrrrrrrrrp');
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No issue found by that title: buuuurrrrrrrrrrrp`))
		}
    });
});

/**
 * get issue - and all of its article/author info - by most recent publication date
 */
describe("get issue by most recent publication date", function () {
    test("works", async function () {
		await Article.create({articleTitle:'Third test article', authorId:1, text:'huzzah!', issueId:2});
		const issue = await Issue.getCurrent();
		expect(issue).toEqual([
			{issueTitle:'Second Test Issue', volume:1, issue:2, pubDate: expect.any(Date), articleId: expect.any(Number),
				articleTitle:'Third test article', text:'huzzah!', authorFirst:'Jon', authorLast:'Johnson',
				 authorHandle:'thejohnsonator'}
		]);
	});
});

/**
 * update an issue { issueTitle, volume, issue, pubDate }
 */
describe("update an issue", function() {
	test("works", async function() {
		const issue = await Issue.update(2, {issueTitle:'whoops, third issue', issue:3});
		expect(issue).toEqual(
			{issueTitle:'whoops, third issue', volume:1, issue:3, pubDate: expect.any(Date)}
		);
	});

	test("no issue matching passed id", async function() {
		try {
			await Issue.update(49,{});
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No issue found by that id: 49`))
		}
	});

});

/**
 * delete an issue
 */
describe("delete issue", function () {
    test("works", async function () {
		const issue = await Issue.delete(1);
		expect(issue).toEqual(
			{issueTitle:'Primary Test Issue', volume:1, issue:1, pubDate: expect.any(Date)}
		);
	});

	test("issue id FK value is 'null' after issue deletion", async function () {
		await Issue.delete(1);
		const article = await Article.get(1);
		expect(article.issueId).toBeNull();
	});

    test("not found/no issue matching passed id", async function () {

		try {
			await Issue.delete(49);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No issue found by that id: 49`))
		}
    });
});

