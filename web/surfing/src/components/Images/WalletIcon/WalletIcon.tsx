type Wallet = 'metamask'

const baseImgPath = "https://static.fluidity.money/images/providers";

const walletImgMap: {[K in Wallet]: string} = {
  metamask: 'metamask.png'
} as const;

type IWalletIcon = Partial<HTMLImageElement> & {
  wallet: Wallet
  style?: React.CSSProperties
};

const WalletIcon = ({ wallet, className, style }: IWalletIcon) => (
  <img
    style={style}
    className={className}
    src={`${baseImgPath}/${walletImgMap[wallet]}`}
    alt={wallet}
  />
);

export default WalletIcon;
