--
-- PostgreSQL database dump
--

-- Dumped from database version 12.16 (Ubuntu 12.16-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.16 (Ubuntu 12.16-0ubuntu0.20.04.1)

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
2	samantha	gretch	wickedStyles	belch master	
1	jimmy	big	campusMan	strong silent type	\N
4	Jamison	Bruxton	boogertrain	hey hi hello and goodnight	
\.


--
-- Data for Name: issues; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.issues (id, issue_title, pub_date) FROM stdin;
1	A New Beginning	2023-11-06
\.


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.articles (id, article_title, author_id, text, issue_id) FROM stdin;
1	rejoice!	2	christ has risen!	1
2	check fraud tips	1	cash dem checks. exercise those fraudulent rights. flex them criminal muscules, etc...	1
4	Playing Gretch-up: The untold story of the Picadilly Pumpernickles	2	Scrappy and bold, their tale yet told! A fascinating glimpse into the subtle perversity of a 5-year-old t-ball team in rust belt america.	1
3	Gretching up with the Gretches	2	we are a family of degenerate gamblers. that's basically it.	1
14	ipsum lorem	1	jalskfj woipeh ildhfkdjnvjasfaj flaefjlkasjflk asjdf ialjefal; jfsd	1
12	pumpkin spiced...	1	we no longer have feelings or rights in this country. we have a never ending assortment of pumpkin spiced YOU NAME IT. j'accuse! SBUX is a rogue operation!!!!!!!	1
\.


--
-- Data for Name: article_keywords; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.article_keywords (article_id, keyword) FROM stdin;
2	retrofuturistic
1	time
1	space
2	mommacita
1	mommacita
2	winning
2	bigtimelies
1	bigtimelies
1	nihilism
2	pleasureful
1	pleasureful
2	WAYtoocool
3	hoes
3	toes
3	bittychachas
12	acres
12	woods
12	time
4	wonderment
4	anticipation
2	pieces
12	toes
4	mysterious
4	hypervigilance
1	stigmata
1	anti-gravity
1	people
1	ppl
3	uncle
3	niece
12	podiatry
12	adamantine
12	exhibition
12	pernickety
3	bygones
3	woebegones
1	treats
1	pizza
2	pizza
3	pizza
12	pizza
4	pizza
1	pizzza
2	pizzza
3	pizzza
12	pizzza
4	pizzza
1	pizzzzaz
2	pizzzzaz
3	pizzzzaz
12	pizzzzaz
4	pizzzzaz
1	zebra
2	zebra
3	zebra
12	zebra
4	zebra
1	zambonis
2	zambonis
3	zambonis
12	zambonis
4	zambonis
4	overrated
12	smellsaplenty
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.users (id, user_first, user_last, email, username, password, is_admin, icon) FROM stdin;
1	Brett	Green	brettalangreen2@gmail.com	bagreen2	$2b$04$PaxFot/74PIEimQ1zeiCnu5r2CF2WZnuT6aXhZe2YzZ8RAVzDaIYe	t	\N
2	Frodo	The Hobbit	earthVibes@gmail.com	frodoBaggins	$2b$04$et8g8ZBYzdcaycwzAekl/.Moxbt54e6c4Y28.5VQyo3Z80R20srbi	f	\N
3	John	Burns	letsgetcraycray@yahoo.com	johnnyPsychotic	$2b$04$4TO4H4ywiLCqefFbsAdXEOP1y.e0oxPt2c.g5dUiD0qaoFsXPTy9a	f	\N
4	Balthazar	Smith	birdenjoyer@yahoo.com	filthMagnet	$2b$04$NXNhXULQJ2trLHy2IDyCT.yo9KOAU04DxIYiNO.SWeZmGDz/0gjw2	f	
5	Ozymandias	Jenkins	apesandshit@boats.net	masterneko	$2b$04$d6WxjXO/3EK/nn2pS7l4vuweBlMuozU2XHnS.g16x8n5esdzBgOtW	t	\N
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.comments (id, user_id, text, article_id, post_date) FROM stdin;
1	1	i prefer pokemon	1	2023-11-08 00:00:00
2	1	...plus, i also prefer wombats and sharks	2	2023-11-08 00:00:00
3	1	bitches, ho(e?)s, oh my!	2	2023-11-08 00:00:00
4	1	jimmy eat world? more like jimmy murdered my whole family and left me homeless :(	1	2023-11-08 00:00:00
5	2	yeah i'm a fucking hobbit, so SUE ME!\nalso sue the gov't	1	2023-11-08 06:00:00
6	3	ate one...depends on individual	12	2023-11-19 19:41:00
7	5	hey...hey! um...nevermind	12	2023-11-19 20:03:00
8	4	i like those things too	1	2023-11-19 20:46:00
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

SELECT pg_catalog.setval('public.articles_id_seq', 14, true);


--
-- Name: authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.authors_id_seq', 4, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.comments_id_seq', 8, true);


--
-- Name: issues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.issues_id_seq', 1, true);


--
-- Name: private_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.private_messages_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--

