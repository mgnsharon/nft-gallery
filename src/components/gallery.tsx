"use client";
import { Nft } from "alchemy-sdk";
import { useCallback, useEffect, useState } from "react";
import { NFTCard } from "./nft-card";
import VirtualScroll from "./virtual-scroll";

export interface GalleryProps {
  pageSize?: number;
}

const CONTRACT_ADDRESS = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

export default function Gallery({ pageSize = 20 }: GalleryProps) {
  const limit = pageSize;
  const buffer = pageSize * 3;
  const cache = pageSize * 2;

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchNfts = useCallback(
    async ({ offset = 0, count = limit }) => {
      setLoading(true);
      const resp = await fetch(
        `/api/gallery?contractAddress=${CONTRACT_ADDRESS}&limit=${count}&offset=${offset}`
      );
      const data = await resp.json();
      setHasNextPage(data.hasMoreNfts);
      return data.nfts;
    },
    [limit]
  );

  const prevCallback = useCallback(
    async (newOffset: number) => {
      try {
        if (newOffset < 0) {
          return false;
        }
        const data = await fetchNfts({ offset: newOffset });
        setNfts([...data, ...nfts.slice(0, cache)]);
        setLoading(false);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchNfts, cache, nfts]
  );

  const nextCallback = useCallback(
    async (newOffset: number) => {
      try {
        const data = await fetchNfts({ offset: newOffset });
        setNfts([...nfts.slice(-cache), ...data]);
        setLoading(false);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchNfts, cache, nfts]
  );

  useEffect(() => {
    fetchNfts({ offset: 0, count: cache })
      .then((res) => {
        setNfts(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [fetchNfts, cache]);

  return (
    <VirtualScroll
      limit={limit}
      buffer={buffer}
      cache={cache}
      rowHeight={276}
      itemWidth={276}
      prevCallback={prevCallback}
      nextCallback={nextCallback}
    >
      {nfts.map((nft) => (
        <NFTCard
          nft={nft}
          key={nft.tokenId}
          className="bg-slate-50 dark:bg-slate-900"
        />
      ))}
    </VirtualScroll>
  );
}
