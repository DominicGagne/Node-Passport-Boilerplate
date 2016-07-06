# Node-Passport-Boilerplate

---

A simple NodeJS boilerplate that demonstrates how to authenticate users against a local database. Will cover Facebook's OAuth in a future release.  I used a MySQL Relational Database because I prefer it over MongoDB, but you can use any type of database with this project, be it either relational or NoSQL.

---

####This project uses node.  Install it using the commands below.


* Linux: `apt-get install node` or equivalent

* OSX: `brew install node` or equivalent

* Windows: God help you

Alternatively, you can download an installer or the binaries from the [official NodeJS website].

[official NodeJS website]: https://nodejs.org/en/download/

---

A sample MySQL database creation script has been provided in the **Database** directory, it is named **PassportAuthSampleDB.sql**.

---

####Running The Project
To launch this application, clone it and navigate to the project's root directory, where the **package.json** file is located.  Run `sudo npm install` to install all dependencies specified in **package.json**.


To host the project, run `node application.js`
