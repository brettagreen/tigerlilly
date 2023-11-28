\echo 'Delete and recreate tigerlilly db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE tigerlilly;
CREATE DATABASE tigerlilly;
\connect tigerlilly

\i tigerlilly-schema.sql
--\i tigerlilly-seed.sql

\echo 'Delete and recreate tigerlilly_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE tigerlilly_test;
CREATE DATABASE tigerlilly_test;
\connect tigerlilly_test

\i tigerlilly-schema.sql
\i tigerlilly-seed.sql
