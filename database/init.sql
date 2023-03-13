CREATE TABLE accounts(
    id INT PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50),
    password VARCHAR(50),
    name VARCHAR(50),
    sername VARCHAR(50),
    FOREIGN KEY (reviewID) REFERENCES reviews(id),
    FOREIGN KEY (productID) REFERENCES products(id),
    FOREIGN KEY (ratingID) REFERENCES ratings(id)
);

CREATE TABLE products(
    id INT PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50),
    price INT,
    description VARCHAR(150),
    --imageString VARCHAR(150),
    tag INT,
    FOREIGN KEY (accountID) REFERENCES accounts(id)
);

CREATE TABLE reviews(
    id INT PRIMARY KEY AUTOINCREMENT,
    review VARCHAR(50),
    FOREIGN KEY (accountID) REFERENCES accounts(id)
);


CREATE TABLE ratings(
    id INT PRIMARY KEY AUTOINCREMENT,
    rate INT,
    FOREIGN KEY (accountID) REFERENCES accounts(id)
);

/*
Adding a test account and some test products to experiment with
*/

INSERT INTO accounts(username, password, name, surname) VALUES ('kevve', 'abc123', 'Kevin', 'Karlsson');

INSERT INTO accounts(username, password, name, surname) VALUES ('smoovi', 'abc123', 'Albin', 'Wiklund');

INSERT INTO products(name, price, description, tag, accountID) VALUES ('Matte bok', 150, 'test description', 1, 1)

INSERT INTO products(name, price, description, tag, accountID) VALUES ('Biologi bok', 200, 'test description', 2, 1)

INSERT INTO products(name, price, description, tag, accountID) VALUES ('Fysik bok', 225, 'test description', 3, 1)

INSERT INTO products(name, price, description, tag, accountID) VALUES ('Svenska bok', 300, 'test description', 4, 2)

INSERT INTO products(name, price, description, tag, accountID) VALUES ('Geografi bok', 275, 'test description', 5, 2)