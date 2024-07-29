--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3 (Ubuntu 16.3-1.pgdg20.04+1)

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
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

--
-- Name: UserRoles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRoles" AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public."UserRoles" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: project_manager_post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_manager_post (
    id integer NOT NULL,
    name character varying(256),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.project_manager_post OWNER TO postgres;

--
-- Name: project_manager_post_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_manager_post_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_manager_post_id_seq1 OWNER TO postgres;

--
-- Name: project_manager_post_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_manager_post_id_seq1 OWNED BY public.project_manager_post.id;


--
-- Name: project_manager_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_manager_session (
    id text NOT NULL,
    user_id text NOT NULL,
    expires_at timestamp with time zone NOT NULL
);


ALTER TABLE public.project_manager_session OWNER TO postgres;

--
-- Name: project_manager_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_manager_user (
    id text NOT NULL,
    name character varying(128),
    email character varying(32),
    user_agent character varying(128),
    password character varying(32),
    password_hash character varying(128),
    google_id character varying(256),
    role public."UserRoles" DEFAULT 'user'::public."UserRoles" NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.project_manager_user OWNER TO postgres;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: project_manager_post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_manager_post ALTER COLUMN id SET DEFAULT nextval('public.project_manager_post_id_seq1'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	9a3c94584ed8d0525576bf785f690f645ed8c1900f63a07031f47dc63db8ae58	1718783757541
\.


--
-- Data for Name: project_manager_post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_manager_post (id, name, created_at, "updatedAt") FROM stdin;
1	test	2024-06-25 22:49:35.518998+00	\N
2	testttttt	2024-06-25 23:00:23.116237+00	\N
3	213123	2024-06-26 23:48:53.942698+00	\N
4	1	2024-06-26 23:56:34.798171+00	\N
5	1	2024-06-27 00:49:02.838646+00	\N
6	3333333	2024-06-27 00:49:08.755857+00	\N
7	123	2024-06-27 23:05:14.659796+00	\N
\.


--
-- Data for Name: project_manager_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_manager_session (id, user_id, expires_at) FROM stdin;
jqrir4lfhroxbvsnxrml7cw4innekro6gqg2tcbe	tm4dzjzurg6xujbq	2024-07-31 20:45:26.583+00
ylkrt34agc2m72shwnkcor2dpca4mn5dib5orw5n	ndlg7zj3fq66esq4	2024-07-31 20:46:10.82+00
bfirf7s5znpvgar6b2i64duhnvshtcdgg3ruwle7	2eatm2kh55aofway	2024-07-31 20:55:56.345+00
\.


--
-- Data for Name: project_manager_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_manager_user (id, name, email, user_agent, password, password_hash, google_id, role, created_at, "updatedAt") FROM stdin;
tm4dzjzurg6xujbq	\N	\N	Test12345	\N	$argon2id$v=19$m=19456,t=2,p=1$c13k1UYZhUJXfjbCZedBMA$PF914R9uVmoLky4h1g6t0NlNbU4zgpLFrbC6ESHTMgY	\N	user	2024-07-01 20:45:26.508568+00	\N
ndlg7zj3fq66esq4	\N	\N	ChristianY	Ghost135!	$argon2id$v=19$m=19456,t=2,p=1$LGlR0NO1ZJ+DazPcUUpqEA$K1TRXXgH+vZCsSsDG65d/CwoTzmx58FPNYWpfCeVW6Y	\N	user	2024-07-01 20:46:10.783711+00	\N
2eatm2kh55aofway	\N	\N	Testuser	123456	$argon2id$v=19$m=19456,t=2,p=1$u4mAtMWlrGif2rbPEwzBWA$64ZiMjW7FGqywyqRAVUzU7t77zlVBeHJtBHovaVhI8U	\N	user	2024-07-01 20:55:56.209453+00	\N
zqd7dhxjbn37vjbj	\N	\N	ChristianY123	123456	$argon2id$v=19$m=19456,t=2,p=1$R29eXRKKb77Kx8636XQVww$s7jHeWe8NvJLJb65lmahyQjlMOJd1ViY7cIHAOa2mgk	\N	user	2024-07-01 21:05:27.495234+00	\N
vygds2dz4xoqtit4	\N	\N	TestHello	123456	$argon2id$v=19$m=19456,t=2,p=1$CgO+U591vno1RSnk+Q0V+g$fT+iRXk3v2Aa43N9i/++WEo1q8GZ9D36G50sVAhGVwc	\N	user	2024-07-02 20:46:37.696977+00	\N
tkav4lbkeujoeknz	\N	\N	test12345	123456	$argon2id$v=19$m=19456,t=2,p=1$IJn7XvtRvt7pCSZVxvjozg$Z75E/aZuERQbvAwBXaiT1jspE398N1ahSibjtgoWPa8	\N	user	2024-07-02 20:47:02.93959+00	\N
kinuyrcw7aoh4j2c	\N	\N	12345676	123456	$argon2id$v=19$m=19456,t=2,p=1$ExaNHepnNatz2I+7wQARQg$eXVsRzoHecmmPoHCbmyHepoaRyBdjHBexQsHDJroODQ	\N	user	2024-07-02 20:54:25.771474+00	\N
dxwt66n34gmtpexn	\N	\N	123456123456	123456	$argon2id$v=19$m=19456,t=2,p=1$vPn/svuXY+Q6oPgWEuis+A$bhbotAEPc8XD31876Vl8Owdi+eATlpHDBWPHsIWVlK0	\N	user	2024-07-02 20:59:36.295282+00	\N
odbhmtupxruesqax	\N	\N	1234561243124	123456	$argon2id$v=19$m=19456,t=2,p=1$yLd1KQd+Z0XISJ7dahIlDw$kv+/x4or21RkPi/k2alGpCIAjvL1VbiqQU4zM615YVY	\N	user	2024-07-02 21:02:45.162211+00	\N
fipnziqfbfqqn77w	\N	\N	12345123412341	123456	$argon2id$v=19$m=19456,t=2,p=1$mspMwxCqOWBVBI5oWWpziA$kDsxqB9QXracQUfqNwNAwhtdvXP3MLQ0/zmHT4mHEqY	\N	user	2024-07-02 21:19:01.757792+00	\N
6zeu6r6hfroujaqy	\N	\N	12345671	123456	$argon2id$v=19$m=19456,t=2,p=1$7LbJOxQ2rW2FoKCs0B9YAA$kb+mgP/TbSmE9DQ15sU2ePPlvjLMa2cacK6RqBng6qg	\N	user	2024-07-02 21:19:46.407582+00	\N
wybuh34h5ovuaxt6	\N	\N	HelloWorld	123456	$argon2id$v=19$m=19456,t=2,p=1$wnPgBckP+6qSGhwn5MRWwA$PAMFJqgN9PuKpTpggO7vOWmcPRAkqu4WQ5Xk7KsbnGo	\N	user	2024-07-03 20:05:42.544975+00	\N
37feyj52ocyluya4	\N	\N	ChristianDev	123456	$argon2id$v=19$m=19456,t=2,p=1$v2kcFOX7W1ZQ1dJ138JPag$/v6Id9CDH5MuN8+OZ3DstXmyBGa9qR4GU8Z7NjaeEp0	\N	user	2024-07-03 20:09:27.456036+00	\N
jod36wntvtptookk	\N	\N	123123123123123	123123123	$argon2id$v=19$m=19456,t=2,p=1$DlmFxFCJUkxhFHLuWCvkPg$n8n6p3K4QK2wD9IRitoGIbcHWR3VeIbDX8nT9ZMcJVU	\N	user	2024-07-03 20:41:08.4804+00	\N
eqoitzov4tus65br	\N	\N	LukeMostert	Ghost135!	$argon2id$v=19$m=19456,t=2,p=1$JPaerx/fRepy42M2A71KnA$xywuCYS2RURfVOS8PciTQJBRj90Uw0k48rpujbnYCj8	\N	user	2024-07-03 21:11:11.429315+00	\N
qim6pleceizojxju	\N	\N	1233254123412521	Ghost135!	$argon2id$v=19$m=19456,t=2,p=1$RDsNOPeSJlPpr+LHhyfhqQ$qVvb+4ujAmCfeNf2eE/5kLr2Ip9u8ptHc6K7te0Augo	\N	user	2024-07-03 21:11:32.497044+00	\N
7ql4ky5fmtzdufl2	\N	\N	TestUser	123456	$argon2id$v=19$m=19456,t=2,p=1$HJjeXp7fd6Y+C5Yqh18tIA$+C80YQeGEq6zWXKDpHClslZbHJNdvnyxQLvj1o/bWsw	\N	user	2024-07-05 22:03:49.490548+00	\N
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, true);


--
-- Name: project_manager_post_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_manager_post_id_seq1', 7, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: project_manager_post project_manager_post_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_manager_post
    ADD CONSTRAINT project_manager_post_pkey1 PRIMARY KEY (id);


--
-- Name: project_manager_session project_manager_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_manager_session
    ADD CONSTRAINT project_manager_session_pkey PRIMARY KEY (id);


--
-- Name: project_manager_user project_manager_user_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_manager_user
    ADD CONSTRAINT project_manager_user_email_unique UNIQUE (email);


--
-- Name: project_manager_user project_manager_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_manager_user
    ADD CONSTRAINT project_manager_user_pkey PRIMARY KEY (id);


--
-- Name: project_manager_user project_manager_user_user_agent_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_manager_user
    ADD CONSTRAINT project_manager_user_user_agent_unique UNIQUE (user_agent);


--
-- Name: name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX name_idx ON public.project_manager_post USING btree (name);


--
-- Name: project_manager_session project_manager_session_user_id_project_manager_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_manager_session
    ADD CONSTRAINT project_manager_session_user_id_project_manager_user_id_fk FOREIGN KEY (user_id) REFERENCES public.project_manager_user(id);


--
-- PostgreSQL database dump complete
--

