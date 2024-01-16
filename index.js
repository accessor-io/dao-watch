

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
    return new BigNumber(value).dividedBy(new BigNumber(10).pow(tokenDecimal)).toString();
}

const appendTransactionsToElement = (transactions, address) => {
    const element = document.getElementById(address);
    transactions.forEach(tx => {
        const convertedValue = convertTransactionValue(tx.value, tx.tokenDecimal);

        // Create a new paragraph element for each transaction
        const txElement = document.createElement('p');
        txElement.classList.add("transaction");

        // Append timestamp
        const timeStampElement = document.createElement('span');
        timeStampElement.textContent = `On ${new Date(tx.timeStamp * 1000).toLocaleString()} `;
        timeStampElement.classList.add("timestamp");
        txElement.appendChild(timeStampElement);
        

        // Append from address
        const fromAddr = document.createElement('span');
        fromAddr.textContent = `${tx.from} sent `;
        fromAddr.classList.add("fromAddr");
        txElement.appendChild(fromAddr);

        // Append converted value
        const conValue = document.createElement('span');
        conValue.textContent = `${convertedValue} `;
        conValue.classList.add("conValue");
        txElement.appendChild(conValue);

        // Append token name
        const tkName = document.createElement('span');
        tkName.textContent = `${tx.tokenName} To: `;
        tkName.classList.add("tkName");
        txElement.appendChild(tkName);

        // Append to address
        const toAddr = document.createElement('span');
        toAddr.textContent = `${tx.to},`;
        toAddr.classList.add("toAddr");
        txElement.appendChild(toAddr);

        // Append the whole txElement to the main element
        element.appendChild(txElement);
    });
};


// Use this function with your transaction data


const fetchAndDisplayTransactions = async () => {
  for (const address of addresses) {
    const transactions = await getERC20Transactions(address);
    appendTransactionsToElement(transactions, address);
  }date
} 
window.onload = fetchAndDisplayTransactions;
