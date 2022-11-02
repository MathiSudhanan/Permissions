# Permissions

Permissions repository contains Permissions API and Permission UI.

Permissions API contains tech stack of Express API, Prisma Client and Mongo DB.

Permission UI contains tech stack of React, TypeScript, Redux Toolkit, Axios.

Permissions is a data entitlement project. It deals with the permissions at data level. This is a sample project with few complexities(fund Report date Permissions, Portfolio permissions and Portfolio Report Date Permissions has been removed) reduced due to time. The permissions can be applied to stat level, category level, fund level, client fund level along with combination of Company, User Group, User with Water flow logic.

Fund: These are collection of securities form Bloomberg.

Client Fund: The client Version of the fund and this will be assciated to a Company. This will be permissioned to a User Group or User.

Category: This is just a Group By Name for the reporting and calculation purpose.

Stats: This is name given for as type of calculation which may be used to calcualte the risk or exposure.

The permisions are applied here with water flow logic.

1) Base Profile: The permissions are given to Stats and Categories as a template to be used later for while retreival for different applications for client usage and reporting based on the logged in User.

2) Company User Group Profile: The permissions are given to Stats and Categories along with Company User Group as overriden permissions and Base Profile as a template to be used later for while retreival for different applications for client usage and reporting based on the logged in User.

3) Hedge Fund Profile: The permissions are given to Stats and Categories for Hedge Fund Level as a template to be used later for while retreival for different applications for client usage and reporting based on the logged in User. The permissions here is most restrictable.

4) Client Fund User Group: The permissions are given to Stats and Categories along with Company User Group as overriden permissions and Company User Group Profile as a template to be used later for while retreival for different applications for client usage and reporting based on the logged in User.

5) Client Fund User: The permissions are given to Stats and Categories along with Company User Group as overriden permissions and used later for while retreival for different applications for client usage and reporting based on the logged in User.
