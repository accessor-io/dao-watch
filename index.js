const ETHERSCAN_API_KEY = 'GEH557JMFGWM3UHSDC91NY3W74J9N3XJJS'; // Replace with your Etherscan API Key
const addresses = [
 "0x0D06A817584ac378849f03Df6F11a9Ad67Dd786D", 
 "0xb3A37C813d3d365a03Dd1dd3E68CC11aF019cDD6",
 "0x69A79128462853833E22bBA1A43bcdAC4725761b",
 "0x9B9c249Be04dd433c7e8FbBF5E61E6741b89966D",
 "0x536013c57DAF01D78e8a70cAd1B1abAda9411819",
 "0xBa0c461b22d918FB1F52fEF556310230d177D1F2",
 "0x2686A8919Df194aA7673244549E68D42C1685d03",
 "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
 "0x1BA8603DA702602A8657980e825A6DAa03Dee93a",
 "0xcfA132E353cB4E398080B9700609bb008eceB125",
 "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
 "0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1"
];

const getERC20Transactions = async (address) => {
 try {
 const response = await axios.get(`https://api.etherscan.io/api`, {
 params: {
 module: 'account',
 action: 'tokentx',
 address: address,
 startblock: 0,
 endblock: 99999999,
 sort: 'asc',
 apikey: ETHERSCAN_API_KEY
 }
 });

 return response.data.result;
 } catch (error) {
 console.error('Error fetching ERC20 transactions:', error);
 return null;
 }
};

function convertTransactionValue(value, tokenDecimal) {
  try {
    return new BigNumber(value).dividedBy(new BigNumber(10).pow(tokenDecimal)).toString();
  } catch (error) {
    console.error('Error in converting transaction value:', error);
    return 'Conversion Error';
  }
 }
 

const appendTransactionsToElement = (transactions, container) => {
 transactions.forEach(tx => {
 const convertedValue = convertTransactionValue(tx.value, tx.tokenDecimal);

 const txElement = document.createElement('div');
 txElement.classList.add("transaction");

 const dateElement = document.createElement('p');
 dateElement.classList.add("date");
 dateElement.textContent = `Date: ${new Date(tx.timeStamp * 1000).toLocaleString()}`;

 const fromElement = document.createElement('p');
 fromElement.classList.add("from");
 fromElement.textContent = `From: ${tx.from}`;

 const toElement = document.createElement('p');
 toElement.classList.add("to");
 toElement.textContent = `To: ${tx.to}`;

 const valueElement = document.createElement('p');
 valueElement.classList.add("value");
 valueElement.textContent = `Value: ${convertedValue} ${tx.tokenName}`;

 txElement.appendChild(dateElement);
 txElement.appendChild(fromElement);
 txElement.appendChild(toElement);
 txElement.appendChild(valueElement);

 container.appendChild(txElement);
 });
};

const showTransactionsForAddress = async (address) => {
 // Hide all containers
 document.querySelectorAll('.container').forEach(container => {
 container.style.display = 'none';
 });

 // Show the container for the selected address
 const containerId = `container_${address}`;
 let container = document.getElementById(containerId);

 if (!container) {
 // If the container doesn't exist, create it and fetch transactions
 container = document.createElement('main');
 container.className = 'container';
 container.id = containerId;
 document.body.appendChild(container); // Append it to the body or a specific parent element
 } else {
 // If container already exists, just show it
 container.style.display = 'block';
 return;
 }

 const transactions = await getERC20Transactions(address);
 if (transactions) {
 appendTransactionsToElement(transactions, container);
 }
};

// Event listener for navigation links
document.querySelectorAll('nav a').forEach(link => {
 link.addEventListener('click', (event) => {
 event.preventDefault();
 const address = link.getAttribute('href').substring(1); // Remove the '#' from the href
 showTransactionsForAddress(address);
 });
});

// Initial load for the first address (optional)
showTransactionsForAddress(addresses[0]);