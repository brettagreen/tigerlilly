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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: article_keywords; Type: TABLE; Schema: public; Owner: bagreen1
--

CREATE TABLE public.article_keywords (
    article_id integer NOT NULL,
    keyword character varying(25) NOT NULL
);


ALTER TABLE public.article_keywords OWNER TO bagreen1;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: bagreen1
--

CREATE TABLE public.articles (
    id integer NOT NULL,
    article_title text NOT NULL,
    author_id integer,
    text text NOT NULL,
    issue_id integer
);


ALTER TABLE public.articles OWNER TO bagreen1;

--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: bagreen1
--

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_id_seq OWNER TO bagreen1;

--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bagreen1
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: authors; Type: TABLE; Schema: public; Owner: bagreen1
--

CREATE TABLE public.authors (
    id integer NOT NULL,
    author_first text NOT NULL,
    author_last text NOT NULL,
    author_handle text NOT NULL,
    author_bio text DEFAULT 'this author prefers to keep an air of mystery about them'::text,
    icon text DEFAULT 'defaultUserIcon.jpg'::text
);


ALTER TABLE public.authors OWNER TO bagreen1;

--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: bagreen1
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.authors_id_seq OWNER TO bagreen1;

--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bagreen1
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: bagreen1
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer,
    text text NOT NULL,
    article_id integer,
    post_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO bagreen1;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: bagreen1
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO bagreen1;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bagreen1
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: issues; Type: TABLE; Schema: public; Owner: bagreen1
--

CREATE TABLE public.issues (
    id integer NOT NULL,
    issue_title text NOT NULL,
    pub_date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.issues OWNER TO bagreen1;

--
-- Name: issues_id_seq; Type: SEQUENCE; Schema: public; Owner: bagreen1
--

CREATE SEQUENCE public.issues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.issues_id_seq OWNER TO bagreen1;

--
-- Name: issues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bagreen1
--

ALTER SEQUENCE public.issues_id_seq OWNED BY public.issues.id;


--
-- Name: private_messages; Type: TABLE; Schema: public; Owner: bagreen1
--

CREATE TABLE public.private_messages (
    id integer NOT NULL,
    sender integer NOT NULL,
    recipient integer NOT NULL,
    message_text text NOT NULL
);


ALTER TABLE public.private_messages OWNER TO bagreen1;

--
-- Name: private_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: bagreen1
--

CREATE SEQUENCE public.private_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.private_messages_id_seq OWNER TO bagreen1;

--
-- Name: private_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bagreen1
--

ALTER SEQUENCE public.private_messages_id_seq OWNED BY public.private_messages.id;


--
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: bagreen1
--

CREATE TABLE public.user_favorites (
    user_id integer NOT NULL,
    article_id integer NOT NULL
);


ALTER TABLE public.user_favorites OWNER TO bagreen1;

--
-- Name: users; Type: TABLE; Schema: public; Owner: bagreen1
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_first text NOT NULL,
    user_last text NOT NULL,
    email text NOT NULL,
    username character varying(25) NOT NULL,
    password text NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    icon text DEFAULT 'defaultUserIcon.jpg'::text,
    CONSTRAINT users_email_check CHECK (("position"(email, '@'::text) > 1))
);


ALTER TABLE public.users OWNER TO bagreen1;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: bagreen1
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO bagreen1;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bagreen1
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: issues id; Type: DEFAULT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.issues ALTER COLUMN id SET DEFAULT nextval('public.issues_id_seq'::regclass);


--
-- Name: private_messages id; Type: DEFAULT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.private_messages ALTER COLUMN id SET DEFAULT nextval('public.private_messages_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


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
4	mysterious
4	hypervigilance
1	stigmata
1	people
1	ppl
1	treats
1	pizza
4	pizza
1	pizzza
4	pizzza
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
27	garbahge
27	garbage
27	men
4	honorable
19	honorable
1	honorable
27	dubious
27	lies
27	quackery
27	dishonesty
27	smelly
27	trepidatious
1	anti-anti-gravity
21	¡bloodbaths!
\.


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.articles (id, article_title, author_id, text, issue_id) FROM stdin;
4	Playing Gretch-up: The untold story of the Picadilly Pumpernickles	2	Scrappy and bold, their tale yet told! A fascinating glimpse into the subtle perversity of a 5-year-old t-ball team in rust belt america.	8
19	umbral blahblahblah	4	let its umbral inky twilight fucking spookiness really get under your skin. as in you're already in the shadows well ahead of time. if that's not foreshadowing, then go ask Steven King, if you can even get his majesty's attention, ykwim?	8
22	Goblin Mischief	2	Art thou hungry for bone-chilling tingles? Wish thee a spook to accompany thee on a cold, windless night?\n\nGrab yourself a goblin!	8
23	annexation of temporary government underway	1	have you ever just...like, I know, right?! the troublemakers in the area are literally planning on annexing our precious temporary government. I'm not saying it's perfect or anything, but without the daily rations of bread and water, I really don't know where I'd be right now!	8
15	lapse into sleep this winter	4	why hibernation is an option for you and your loved ones, especially this time of year!!!! 	8
27	Garbagemen's lies	\N	they tell lies to us. 	8
21	feels bad man	1	kids and dynamite may...MAY...mix, but only under the most specific of circumstances (e.g. you're trying to kill a kid with dynamite).	8
1	rejoice!	8	christ has risen! and he brought candy!	8
\.


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.authors (id, author_first, author_last, author_handle, author_bio, icon) FROM stdin;
5	doris	doolittle	lazybones	I habe sehnsucht	lazybones_authorIcon.jpeg
4	Jamison	bruxton	XTimeToBoogieX	ending horribleness one article at a time!!	boogertrain_authorIcon.jpeg
2	samantha	gretch	wickedStyles	stories are our intoxication	wickedStyles_authorIcon.jpeg
8	hopeful	the clown	watchItGlow	is clown honk honk hahahaha laff joy balloons hijinx mayhem mischief and waaaaaaaaaaay too many birthday parties!	clownMeansClownWays_authorIcon.jpeg
1	jimmy	big	campusMan	strong silent type...coming to a campus near you	campusMan_authorIcon.jpeg
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.comments (id, user_id, text, article_id, post_date) FROM stdin;
5	\N	yeah i'm a fucking hobbit, so SUE ME!\nalso sue the gov't	1	2023-11-08 06:00:00
8	\N	i like those things tooooo	1	2023-11-20 02:46:00
4	3	jimmy eat world? more like jimmy murdered my whole family and left me homeless :(	19	2023-11-08 18:00:00
1	1	i prefer pokemon...pokeMEN	1	2023-11-08 06:00:00
\.


--
-- Data for Name: issues; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.issues (id, issue_title, pub_date) FROM stdin;
8	An Eruption of Evil	2023-12-31
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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bagreen1
--

COPY public.users (id, user_first, user_last, email, username, password, is_admin, icon) FROM stdin;
14	Japeth	Smith	loudmouth@whooooooooo.com	monsieuryum	$2b$04$0dNQG4eGnEQF7AkWKv7zvOa3QsAiUJgLXoFhHtSF36wr7Fue35E06	f	mryummy_userIcon.jpeg
0	anonymous	anonymous	a@b.com	anonymous	alsdkjfwioejruionwenj weriojgmvoserijgnvowierujt 98wujgowvi	f	defaultUserIcon.jpg
1	Brett	Green	brettalangreen2@gmail.com	bagreen2	$2b$04$PaxFot/74PIEimQ1zeiCnu5r2CF2WZnuT6aXhZe2YzZ8RAVzDaIYe	t	bagreen2_userIcon.jpeg
6	egg	buster	egg@egg.com	eggerlover	$2b$04$1Mc4.6Vfgh71exnKaGQTTeoy3eLFiPpYjnQPAm47dronyQsgye2ye	f	eggerlover_userIcon.jpeg
3	John	Burns	someonehelpmeeeeee@yahoo.com	johnnyPsychotic	$2b$04$4TO4H4ywiLCqefFbsAdXEOP1y.e0oxPt2c.g5dUiD0qaoFsXPTy9a	f	\N
\.


--
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.articles_id_seq', 27, true);


--
-- Name: authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.authors_id_seq', 9, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.comments_id_seq', 22, true);


--
-- Name: issues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.issues_id_seq', 11, true);


--
-- Name: private_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.private_messages_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bagreen1
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- Name: article_keywords article_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.article_keywords
    ADD CONSTRAINT article_keywords_pkey PRIMARY KEY (article_id, keyword);


--
-- Name: articles articles_article_title_key; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_article_title_key UNIQUE (article_title);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: authors authors_author_handle_key; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_author_handle_key UNIQUE (author_handle);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: issues issues_pkey; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_pkey PRIMARY KEY (id);


--
-- Name: private_messages private_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.private_messages
    ADD CONSTRAINT private_messages_pkey PRIMARY KEY (id);


--
-- Name: user_favorites user_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (user_id, article_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: article_keywords article_keywords_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.article_keywords
    ADD CONSTRAINT article_keywords_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;


--
-- Name: articles articles_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: articles articles_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id) ON DELETE SET NULL;


--
-- Name: comments comments_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: private_messages private_messages_recipient_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.private_messages
    ADD CONSTRAINT private_messages_recipient_fkey FOREIGN KEY (recipient) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: private_messages private_messages_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.private_messages
    ADD CONSTRAINT private_messages_sender_fkey FOREIGN KEY (sender) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_favorites user_favorites_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;


--
-- Name: user_favorites user_favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bagreen1
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

