CREATE USER 'EddyStore'@'localhost' IDENTIFIED BY 'XEFQ12ab';
GRANT ALL PRIVILEGES ON *.* TO 'EddyStore'@'localhost' WITH GRANT OPTION;
CREATE USER 'EddyStore'@'%' IDENTIFIED BY 'XEFQ12ab';
GRANT ALL PRIVILEGES ON *.* TO 'EddyStore'@'%' WITH GRANT OPTION;

CREATE DATABASE EddyStore;