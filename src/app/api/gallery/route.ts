import {
  Network,
  Alchemy,
  GetNftsForContractOptions,
  NftContractNftsResponse,
  Nft,
} from "alchemy-sdk";

export interface GetGalleryParams {
  contractAddress: string;
  omitMetadata?: boolean;
  offset?: string;
  limit?: number;
}

export interface GetGalleryResponseData {
  nfts: Nft[];
  hasNextPage: boolean;
}

const { ALCHEMY_API_KEY: apiKey } = process.env;
const config = {
  apiKey,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams.get("contractAddress");
  const omitMetadata = searchParams.get("omitMetadata") || false;
  const offset = searchParams.get("offset") || "";
  const limit = searchParams.get("limit") || 100;

  try {
    if (!contractAddress) {
      throw new Error("contractAddress is required");
    }
    const opts: GetNftsForContractOptions = {};
    if (omitMetadata && omitMetadata === "true") {
      opts.omitMetadata = true;
    }
    if (offset) {
      opts.pageKey = offset;
    }
    if (limit) {
      opts.pageSize = Number(limit);
    }

    const { nfts, pageKey }: NftContractNftsResponse =
      await alchemy.nft.getNftsForContract(contractAddress, opts);
    const response = { nfts, hasNextPage: !!pageKey };
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
}
