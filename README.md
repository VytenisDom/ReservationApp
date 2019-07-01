Step by step tutorial on how to run this on your PC.

1. Download this repository.
2. Download NodeJs and install it on your computer.
3. Download XAMPP and install it on your computer.
4. Run xampp_control.exe and run both Apache and MySql on your localhost.
5. Go to your preffered browser and type in localhost/phpmyadmin
6. Create a database called 'registrations'
7. Run this command in phpmyadmin : CREATE TABLE appregistrations ( ID INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, FirstName VARCHAR(30), LastName VARCHAR(30), Date VARCHAR(10), Time VARCHAR(10), DateOfRes VARCHAR(10), DatePreview VARCHAR(50))
8. In the downloaded repository open cmd, git bash or any other terminal ( VS Code terminal works as well )
9. Type in node app.js
10. Go to your browser and type in localhost:3000


  