export default {
  homestead: {
    oracles: {
      EUR_USD: "0xb49f677943BC038e9857d61E7d053CaA2C1734C1",
      USDC_USD: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
      ETH_USD: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
    }
  },
  kovan: {
    oracles: {
      EUR_USD: "0x0c15Ab9A0DB086e062194c273CC79f41597Bbf13",
      USDC_USD: "0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60",
      ETH_USD: "0x9326BFA02ADD2366b30bacB125260Af641031331",
      JPY_USD: "0xD627B1eF3AC23F1d3e576FA6206126F3c1Bd0942"
    },
    supportedCollateral: [
      {
        name: "USDC",
        address: "0xe22da380ee6b445bb8273c81944adeb6e8450422"
      },
      {
        name: "aUSDC",
        address: "0xe12afec5aa12cf614678f9bfeeb98ca9bb95b5b0"
      }
    ]
  },
  rinkeby: {
    oracles: {
      EUR_USD: "0x78F9e60608bF48a1155b4B2A5e31F32318a1d85F",
      USDC_USD: "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
      ETH_USD: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
    }
  },
  polygon: {
    oracles: {
      USDC_USD: "0x78F9e60608bF48a1155b4B2A5e31F32318a1d85F",
      ETH_USD: "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    }
  }
};
