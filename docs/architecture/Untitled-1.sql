E:\intelligent-learning-platform\.env.localCREATE DATABASE IF NOT EXISTS educational_platform;

CREATE USER IF NOT EXISTS 'iamstudent'@'localhost'
IDENTIFIED BY 'your_local_password';

ALTER USER 'iamstudent'@'localhost'
IDENTIFIED BY 'your_local_password';

GRANT ALL PRIVILEGES ON educational_platform.*
TO 'iamstudent'@'localhost';

FLUSH PRIVILEGES;