CREATE TABLE accounts(
    id INT PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50),
    password VARCHAR(50),
    name VARCHAR(50),
    FOREIGN KEY (reviewID) REFERENCES reviews(id)-
);

CREATE TABLE products(
    id INT PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50),
    price INT,

);

CREATE TABLE reviews(
    id INT PRIMARY KEY AUTOINCREMENT,
    review VARCHAR(50)
);


CREATE TABLE ratings(
    id INT PRIMARY KEY AUTOINCREMENT,
    rate INT
);



INSERT INTO humans (name) VALUES ('Alice');