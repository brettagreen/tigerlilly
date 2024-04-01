"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const Author = require("../models/author");
const Article = require("../models/article")
const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**
 * create author
 */
describe("create new author", function () {
    test("works", async function () {
        let body = {author:'ezekiel miller', authorFirst: 'ezekiel', authorLast: 'miller', authorHandle:'theONE', authorSlogan:'been a minute',
                        authorBio: 'school of hard knox', icon:'theONE_icon.jpg'}
      	const author = await Author.create(body, 'theONE_icon.jpg');
        body.id = 3;
      	expect(author).toEqual(body);
    });

    test("duplicate already exists", async function () {
		try {
            const body = {authorFirst: 'ezekiel', authorLast: 'miller', authorHandle:'theONE', authorSlogan:'been a minute',
                            authorBio: 'school of hard knox'}
			await Author.create(body);
		} catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching('Duplicate author handle: theONE'));
		}
    });

    test("default bio and icon values", async function () {
        const body = {authorFirst: 'arnold', authorLast: 'brewer', authorHandle:'brewski', authorSlogan:'live laugh love'}
      	const author = await Author.create(body);
      	expect(author.authorBio).toEqual('this author prefers to keep an air of mystery about them');
        expect(author.icon).toEqual('defaultUserIcon.jpg');
    });

});

/**
 * get all authors
 */
describe("get all authors", function () {
    test("works", async function () {
		const authors = await Author.findAll();

		expect(authors).toEqual([
			{id:1, author:'Jon Johnson', authorFirst:'Jon', authorLast:'Johnson', authorHandle:'thejohnsonator', 
                authorSlogan:'where is the beef?', authorBio:'veni vidi vici', icon:'jonauthor.jpg'},
			{id:2, author:'Destiny Wilson', authorFirst:'Destiny', authorLast:'Wilson', authorHandle:'futureperfect', 
                authorSlogan:'no comment', authorBio:'small town girl', icon:'destinyauthor.jpg'}
		]);
    });
});

/** 
 * get author by author handle
 */
describe("get by author handle", function () {
    test("works", async function () {
		const author = await Author.get('futureperfect');
		expect(author).toEqual(
			{author:'Destiny Wilson', authorFirst:'Destiny', authorLast:'Wilson', authorHandle:'futureperfect', 
                authorSlogan:'no comment', authorBio:'small town girl', icon:'destinyauthor.jpg'}
		);
	});

    test("not found/no such handle", async function () {
		try {
			await Author.get('boogiebear');
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching('No author found by that handle: boogiebear'))
		}
    });
});

/**
 * get author handle by passing author id
 */
describe("get author handle by author id", function () {
    test("works", async function () {
		const authorHandle = await Author.getHandle(2);
		expect(authorHandle).toEqual('futureperfect');
	});

    test("no author/handle by that id", async function () {
		try {
			await Author.getHandle(9);
		} catch (err) {
			expect(err.message).toEqual(expect.stringMatching('No author found by that id: 9'))
		}
    });
});

/**
 * update an author. all author fields can be modified.
 */
describe("update author", function () {
    test("works", async function () {
		const body = {authorFirst: 'Brett', authorSlogan: 'more cheese please'}
		const author = await Author.update(1, body, 'updated_icon.jpg')
		expect(author).toEqual(
			{author:'Brett Johnson', authorFirst:'Brett', authorLast:'Johnson', authorHandle:'thejohnsonator', 
                authorSlogan:'more cheese please', authorBio:'veni vidi vici', icon:'updated_icon.jpg'}
		);
	});

	test("works with no and/or redundant updates passed", async function () {
		const body = {authorBio: 'small town girl'}
		let author = await Author.update(2, body)
		expect(author).toEqual(
			{author:'Destiny Wilson', authorFirst:'Destiny', authorLast:'Wilson', authorHandle:'futureperfect', 
                authorSlogan:'no comment', authorBio:'small town girl', icon:'destinyauthor.jpg'}
		);
	});

    test("not found/no article matching passed id", async function () {

		try {
			const body = {authorBio: 'chicken'}
			await Author.update(834, body, 'skittlez.png');
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No author found by that id: 834`))
		}
    });
});


/**
 * delete an author
 */
describe("delete author", function () {
    test("works", async function () {
		const author = await Author.delete(2);
		expect(author).toEqual(
			{author:'Destiny Wilson', authorFirst:'Destiny', authorLast:'Wilson', authorHandle:'futureperfect', 
                authorSlogan:'no comment', authorBio:'small town girl', icon:'destinyauthor.jpg'}
		);
	});

	test("article author info should be null when author is deleted", async function () {
		await Author.delete(2);
		const article = await Article.get(2);
		expect(article.authorFirst).toBeNull();
		expect(article.authorLast).toBeNull();
		expect(article.authorHandle).toBeNull();
	});

    test("not found/no author matching passed id", async function () {

		try {
			await Author.delete(49);
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
			expect(err.message).toEqual(expect.stringMatching(`No author found by that id: 49`))
		}
    });
});

