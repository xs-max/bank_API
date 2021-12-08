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