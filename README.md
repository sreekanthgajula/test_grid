

1. Download the project and run `npm install`.  
2. To run the project locally, execute `npm run dev`.  
3. In this project, I have created two components:  
   - **Modal** --its a component which lets us use modal dialog
   - **UsersGrid** -its a grid which has pagination and search functionality 
4. I used the `user.json` file which got generated after running the provided code for the exam.  
5. Unit test cases have been added directly to the specific components directory for ease of use,
6. the images urls which json data generated were faulty so i replaced the image url with a image pointing to my local image for asthetic purpose
7. added redux to application to access users.json object
8. added conditional rendering to grid to handle a case when fetchData method  in src\components\redux\dataSlice.ts throws error then we show a message "Error: Loading Grid Data"  way to test is change this line
9. const response = await fetch('/users.json1');---> here i changed the name of file from users.json to users.json1 and we see a error message displayed saying "Error: Loading Grid Data"
10. when user searches for data which is not present in grid we are showing "No data found" message
11. used selector to get the data  and later we have set it in corresponding useState variables so that data is displayed in grid
    

