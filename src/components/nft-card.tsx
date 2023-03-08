import { Nft } from "alchemy-sdk";
import Image from "next/image";

export interface NFTCardProps extends React.HTMLAttributes<HTMLDivElement> {
  nft: Nft;
  className?: string;
}

export function NFTCard({ nft, className = "" }: NFTCardProps) {
  return (
    <div className={`relative mr-4 mb-4 rounded-xl ${className}`}>
      <Image
        src={
          nft.rawMetadata?.image?.replace(
            "ipfs://",
            "https://nftstorage.link/ipfs/"
          ) ?? ""
        }
        alt={nft.title}
        width={260}
        height={260}
      />
      <div className="absolute top-0 right-0 left-0 h-12 rounded-t-xl bg-black/20">
        <div className="absolute top-2 left-2">
          <div className="flex items-center space-x-1">
            <h3 className="text-3xl font-semibold text-slate-100 drop-shadow-md">
              {nft.tokenId}
            </h3>
            <span className="text-sm font-thin tracking-widest text-slate-50 drop-shadow-md">
              {nft.contract.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
