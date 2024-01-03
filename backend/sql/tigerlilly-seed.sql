--
-- PostgreSQL database dump
--

-- Dumped from database version 12.17 (Ubuntu 12.17-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.17 (Ubuntu 12.17-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.authors (id, author_first, author_last, author_handle, author_bio, icon) FROM stdin;
1	jimmy	big	campusMan	strong silent type	campusMan_authorIcon.jpeg
5	doris	doolittle	lazybones	I habe sehnsucht	lazybones_authorIcon.jpeg
4	Jamison	bruxton	XTimeToBoogieX	ending horribleness one article at a time!!	boogertrain_authorIcon.jpeg
2	samantha	gretch	wickedStyles	stories are our intoxication	wickedStyles_authorIcon.jpeg
\.


--
-- Data for Name: issues; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.issues (id, issue_title, pub_date) FROM stdin;
1	Dr Doolittle's Animal Emporium	2023-11-06
\.


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.articles (id, article_title, author_id, text, issue_id) FROM stdin;
4	Playing Gretch-up: The untold story of the Picadilly Pumpernickles	2	Scrappy and bold, their tale yet told! A fascinating glimpse into the subtle perversity of a 5-year-old t-ball team in rust belt america.	1
19	umbral blahblahblah	4	let its umbral inky twilight fucking spookiness really get under your skin. as in you're already in the shadows well ahead of time. if that's not foreshadowing, then go ask Steven King, if you can even get his majesty's attention, ykwim?	1
22	Goblin Mischief	2	Art thou hungry for bone-chilling tingles? Wish thee a spook to accompany thee on a cold, windless night?\n\nGrab yourself a goblin!	1
23	annexation of temporary government underway	1	have you ever just...like, I know, right?! the troublemakers in the area are literally planning on annexing our precious temporary government. I'm not saying it's perfect or anything, but without the daily rations of bread and water, I really don't know where I'd be right now!	1
1	rejoice!	\N	christ has risen! and he brought candy!	1
15	lapse into sleep this winter	4	why hibernation is an option for you and your loved ones, especially this time of year!!!! 	1
21	feels bad man	1	kids and dynamite may...MAY...mix, but only under the most specific of circumstances (e.g. you're trying to kill a kid with dynamite).	1
20	pizza mouth, pizza accumulation	4	why eat pizza when you can indulge in sweets?\nwhy eat pizza when you can indulge in sweets?\nwhy eat pizza when you can indulge in sweets?\nwhy eat pizza when you can indulge in sweets?\nwhy eat pizza when you can indulge in sweets?\nwhy eat pizza when you can indulge in sweets?	\N
\.


--
-- Data for Name: article_keywords; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.article_keywords (article_id, keyword) FROM stdin;
1	time
1	space
1	mommacita
1	bigtimelies
1	nihilism
1	pleasureful
4	wonderment
4	anticipation
4	mysterious
4	hypervigilance
1	stigmata
1	anti-gravity
1	people
1	ppl
1	treats
1	pizza
4	pizza
1	pizzza
4	pizzza
1	pizzzzaz
4	pizzzzaz
1	zebra
4	zebra
1	zambonis
4	zambonis
4	overrated
4	HIGHlarious
19	HIGHlarious
1	HIGHlarious
21	HIGHlarious
15	HIGHlarious
4	bloodbaths
19	bloodbaths
1	bloodbaths
21	bloodbaths
15	bloodbaths
21	honorable
21	designtechnique
4	grassfed
19	grassfed
1	grassfed
21	grassfed
15	grassfed
4	brandnew
19	brandnew
1	brandnew
21	brandnew
15	brandnew
4	cRuNcH
19	cRuNcH
1	cRuNcH
21	cRuNcH
15	cRuNcH
4	honorable
19	honorable
1	honorable
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.users (id, user_first, user_last, email, username, password, is_admin, icon) FROM stdin;
0	anonymous	anonymous	a@b.com	anonymous	alsdkjfwioejruionwenj weriojgmvoserijgnvowierujt 98wujgowvi	f	defaultUserIcon.jpg
1	Brett	Green	brettalangreen2@gmail.com	bagreen2	$2b$04$PaxFot/74PIEimQ1zeiCnu5r2CF2WZnuT6aXhZe2YzZ8RAVzDaIYe	t	bagreen2_userIcon.jpeg
2	Frodo	The Hobbit	earthVibes@gmail.com	frodoBaggins	$2b$04$et8g8ZBYzdcaycwzAekl/.Moxbt54e6c4Y28.5VQyo3Z80R20srbi	f	frodoBaggins_userIcon.jpeg
6	egg	buster	egg@egg.com	eggerlover	$2b$04$1Mc4.6Vfgh71exnKaGQTTeoy3eLFiPpYjnQPAm47dronyQsgye2ye	f	eggerlover_userIcon.jpeg
3	John	Burns	letsgetcraycray@yahoo.com	johnnyPsychotic	$2b$04$4TO4H4ywiLCqefFbsAdXEOP1y.e0oxPt2c.g5dUiD0qaoFsXPTy9a	f	johnnyPsychotic_userIcon.jpeg
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.comments (id, user_id, text, article_id, post_date) FROM stdin;
1	1	i prefer pokemon	1	2023-11-08 00:00:00
4	1	jimmy eat world? more like jimmy murdered my whole family and left me homeless :(	1	2023-11-08 00:00:00
5	2	yeah i'm a fucking hobbit, so SUE ME!\nalso sue the gov't	1	2023-11-08 06:00:00
8	\N	i like those things too	1	2023-11-19 20:46:00
9	2	outrageous!	4	2023-11-27 15:07:46.257617
10	2	sensational!	4	2023-11-27 15:11:39.765834
11	2	sensational!	4	2023-11-27 15:13:38.422805
12	2	sensational!	4	2023-11-27 15:17:33.202732
13	2	sensational!	4	2023-11-27 15:20:18.242449
14	3	gross	22	2023-11-27 15:22:32.157877
16	6	bloop bleep *creaky noises* (give me oil!) clack *ding*	22	2023-11-28 11:47:14.22117
\.


--
-- Data for Name: private_messages; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.private_messages (id, sender, recipient, message_text) FROM stdin;
\.


--
-- Data for Name: user_favorites; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.user_favorites (user_id, article_id) FROM stdin;
\.


--
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.articles_id_seq', 23, true);


--
-- Name: authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.authors_id_seq', 7, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.comments_id_seq', 16, true);


--
-- Name: issues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.issues_id_seq', 7, true);


--
-- Name: private_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.private_messages_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--

