CREATE USER otp_admin WITH PASSWORD 'password';

CREATE DATABASE otp_test WITH OWNER otp_admin ENCODING 'UTF8';

GRANT ALL ON DATABASE otp_test TO otp_admin;
