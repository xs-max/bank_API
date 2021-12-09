exports.createAccountNumber = () => {
    const numbers = "0123456789";
    var accountNumber = "";
    for (i = 0; i < numbers.length; i++) {
      var randomChar = numbers.charAt(
        Math.floor(Math.random() * numbers.length)
      );
      accountNumber += randomChar;
    }
    return accountNumber;
}

exports.createTransactionID = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz12345567890";
  var transactionID = "";
  for (i = 0; i < 30; i++) {
    var randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    transactionID += randomChar;
  }
  return transactionID;
}