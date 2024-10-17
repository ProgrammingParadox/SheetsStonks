function getUserEmail() {
  return Session.getActiveUser().getEmail();
}

function CheckUserExists(user) {
  // open up data
  let ss = SpreadsheetApp.openById("14daAKLZ1sudhFtfK2yANd1K8t2mkal09eGi0FFaUPGY");

  let people = ss.getRange("Data!D2:D1000").getValues().flat().filter(a => a != '');

  return people.indexOf(user.toLowerCase()) != -1;
}

function getUserIndex(user) {
  let ss = SpreadsheetApp.openById("14daAKLZ1sudhFtfK2yANd1K8t2mkal09eGi0FFaUPGY");

  let people = ss.getRange("Data!D2:D1000");
  let peopleArray = people.getValues().flat();

  let userIndex = peopleArray.indexOf(user.toLowerCase());

  return userIndex;
}

function GetUserMoney(user) {
  let ss = SpreadsheetApp.openById("14daAKLZ1sudhFtfK2yANd1K8t2mkal09eGi0FFaUPGY");

  let userIndex = getUserIndex(user);

  let money = ss.getRange("Data!E2:E1000").getValues().flat();

  return money[userIndex];
}

function AddUser(user, start) {
  let ss = SpreadsheetApp.openById("14daAKLZ1sudhFtfK2yANd1K8t2mkal09eGi0FFaUPGY");
  
  let people = ss.getRange("Data!D2:D1000");
  let peopleArray = people.getValues();
  let peopleArrayLength = peopleArray.filter(a => a[0].length != 0).length;
  peopleArray[peopleArrayLength] = [ user ];

  people.setValues(peopleArray);

  let money = ss.getRange("Data!E2:E1000");
  let moneyArray = money.getValues();
  let moneyArrayLength = moneyArray.filter(a => a[0].length != 0).length;
  moneyArray[moneyArrayLength] = [ start ]

  money.setValues(moneyArray);
}

function BuyStock(user, stock, amnt){

}

function GetUserStocks(user) {
  let ss = SpreadsheetApp.openById("14daAKLZ1sudhFtfK2yANd1K8t2mkal09eGi0FFaUPGY");

  let people = ss.getRange("Data!D2:D1000");
  let peopleArray = people.getValues().flat();

  let userIndex = peopleArray.indexOf(user);

  let stocks = ss.getRange("Data!F2:F1000").getValues();

  if(stocks[userIndex] == "") return [];

  return JSON.parse(stocks[userIndex]);
}
function SetUserStocks(user, newStock) {
  let ss = SpreadsheetApp.openById("14daAKLZ1sudhFtfK2yANd1K8t2mkal09eGi0FFaUPGY");

  let UserIndex = getUserIndex(user);
  
  let stocks = ss.getRange("Data!F2:F1000");
  let stockArray = stocks.getValues();
  
  stockArray[UserIndex] = [ JSON.stringify(newStock) ];

  stocks.setValues(stockArray);
}

function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Stock Stuff')
      .addItem('Show sidebar', 'showSidebar')
      .addToUi();
}

function showSidebar() {
  let html = HtmlService.createHtmlOutputFromFile('sidebar.html')
    .setTitle('Stonks');
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showSidebar(html);
}

function StartForm() {
  onOpen();

  let ui = SpreadsheetApp.getUi();

  let user = getUserEmail();

  let exists = CheckUserExists(user);
  if(!exists) AddUser(user, 100);

  let money = GetUserMoney(user);

  ui.alert(
    "Welcome to the Stock Buying form! " + 
    (exists ? 
      (" You have " + money + " in the bank right now.") : 
      "Looks like you haven't been here before. We'll add you with 100 moneys :)"
    )
  );

  let userStocks = GetUserStocks(user);

  console.log(userStocks);

  showSidebar();
}
