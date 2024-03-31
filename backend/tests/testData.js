const db = require("../db");
const User = require("../models/user");

async function createTestData() {
    await db.query("DELETE FROM article_keywords");
    await db.query("DELETE FROM articles");
    await db.query("DELETE FROM authors");
    await db.query('DELETE from feedback');
    await db.query("DELETE FROM issues");
    await db.query('DELETE from user_favorites');
    await db.query("DELETE FROM users");
    await db.query("SELECT setval('articles_id_seq', 1, false)");
    await db.query("SELECT setval('authors_id_seq', 1, false)");
    await db.query("SELECT setval('feedback_id_seq', 1, false)");
    await db.query("SELECT setval('issues_id_seq', 1, false)");
    await db.query("SELECT setval('users_id_seq', 1, false)");
	await insertions();
}

async function insertions() {
	//users
	//run user creation thru function instead of direct insert to ensure hashed pw stored to db
	await User.register({username:'admin_test', password:'abc123', userFirst:'mradmin', userLast:'theadminuser',
			email:'admin@email.com', isAdmin:true }, 'admin_icon.jpg');
	await User.register({username:'regular_test', password:'abc123', userFirst:'mrsuser', userLast:'theregularuser',
			email:'regularuser@email.com', isAdmin:false }, 'regular_icon.jpg');

	//issues
	await db.query(`
		INSERT INTO issues(issue_title, volume, issue, pub_date)
			VALUES ('Primary Test Issue', 1, 1, '2024-01-01'),
					('Second Test Issue', 1, 2, '2024-02-29')
	`);

	//authors
	await db.query(`
		INSERT INTO authors (author_first, author_last, author_handle, author_bio, icon, author_slogan)
			VALUES ('Jon', 'Johnson', 'thejohnsonator', 'veni vidi vici', 'jonauthor.jpg', 'where is the beef?'),
					('Destiny', 'Wilson', 'futureperfect', 'small town girl', 'destinyauthor.jpg', 'no comment')
	`);

	//articles
	await db.query(`
		INSERT INTO articles(article_title, author_id, text, issue_id)
			VALUES ('First test article', 1, 'gobble gobble!', 1),
					('Second test article', 2, 'funny stuff. ipsum lorem.', 1)
	`);

	//feedback
	await db.query(`
		INSERT INTO feedback(name, email, feedback)
			VALUES ('Coco Clemens', 'coco@email.com', 'ok, first of all...'),
					('Excellence Abrams', 'abrams@email.com', 'love the site, however, I have a few problems...')
	`);

	//keywords
	await db.query(`
		INSERT INTO article_keywords (article_id, keyword)
			VALUES (1, 'funny'),
				   (1, 'excellent'),
				   (1, 'groaner'),
				   (2, 'funny'),
				   (2, 'improper')
	`);

}

module.exports = createTestData;