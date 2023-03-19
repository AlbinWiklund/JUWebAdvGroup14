CREATE TABLE IF NOT EXISTS accounts(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    password VARCHAR(50),
    name VARCHAR(50),
    surname VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS books(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    price INT,
    description VARCHAR(150),
    category VARCHAR(50),
    accountID INT,
    FOREIGN KEY (accountID) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS reviews(
    id INT PRIMARY KEY AUTO_INCREMENT,
    review VARCHAR(50),
    rating INT,
    accountID INT,
    FOREIGN KEY (accountID) REFERENCES accounts(id)
);

