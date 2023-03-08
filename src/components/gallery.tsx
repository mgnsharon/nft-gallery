"use client";
import {
  FixedSizeGrid,
  FixedSizeGridProps,
  GridOnItemsRenderedProps,
  ListOnItemsRenderedProps,
} from "react-window";
import { Nft } from "alchemy-sdk";
import {
  GetGalleryResponseData,
  GetGalleryParams,
} from "@/app/api/gallery/route";
import { useEffect, useState, useCallback } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { NFTCard } from "./nft-card";
import SkeletonLoader from "./skeleton-loader";

const CONTRACT_ADDRESS = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

export async function getData({
  contractAddress,
  offset = "0",
  limit = 20,
}: GetGalleryParams): Promise<GetGalleryResponseData> {
  const resp = await fetch(
    `/api/gallery?contractAddress=${contractAddress}&offset=${offset}&limit=${limit}`
  );
  const data = await resp.json();
  return data;
}

export default function Gallery() {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const isItemLoaded = useCallback(
    (index: number) => !hasNextPage || index < nfts.length,
    [hasNextPage, nfts]
  );

  const loadNextPage = useCallback(
    async (startIndex: number, stopIndex: number) => {
      if (!hasNextPage || isNextPageLoading) {
        return;
      }
      try {
        setIsNextPageLoading((_) => true);
        const data = await getData({
          contractAddress: CONTRACT_ADDRESS,
          offset: `${stopIndex}`,
          limit: 20,
        });
        setHasNextPage((_) => data.hasNextPage);
        setNfts((prev) => [...prev, ...data.nfts]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsNextPageLoading((_) => false);
      }
    },
    []
  );

  useEffect(() => {
    setIsNextPageLoading((_) => true);
    getData({ contractAddress: CONTRACT_ADDRESS })
      .then((data) => {
        setHasNextPage((_) => data.hasNextPage);
        setNfts((_) => data.nfts);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsNextPageLoading((_) => false);
      });
  }, []);

  return (
    <div className="h-screen w-full">
      <AutoSizer>
        {({ height, width }) => {
          const columnWidth = 276;
          const rowHeight = 276;
          const columnCount = Math.floor(width / columnWidth);
          return (
            <InfiniteLoader
              minimumBatchSize={20}
              isItemLoaded={isItemLoaded}
              itemCount={hasNextPage ? nfts.length + 1 : nfts.length}
              loadMoreItems={loadNextPage}
              threshold={30}
            >
              {({ onItemsRendered, ref }) => {
                const onGridItemsRendered = ({
                  visibleRowStartIndex,
                  visibleRowStopIndex,
                  visibleColumnStopIndex,
                  overscanColumnStopIndex,
                  overscanRowStartIndex,
                  overscanRowStopIndex,
                }: GridOnItemsRenderedProps) => {
                  const useOverScan = true;
                  const endColumnIndex =
                    (useOverScan
                      ? overscanColumnStopIndex
                      : visibleColumnStopIndex) + 1;
                  const startRowIndex = useOverScan
                    ? overscanRowStartIndex
                    : visibleRowStartIndex;
                  const endRowIndex = useOverScan
                    ? overscanRowStopIndex
                    : visibleRowStopIndex;
                  const visibleStartIndex = startRowIndex * endColumnIndex;
                  const visibleStopIndex = endRowIndex * endColumnIndex;
                  onItemsRendered({
                    visibleStartIndex,
                    visibleStopIndex,
                    overscanStartIndex: overscanRowStartIndex,
                    overscanStopIndex: overscanRowStopIndex,
                  });
                };
                return (
                  <FixedSizeGrid
                    width={width}
                    height={height}
                    columnCount={columnCount}
                    columnWidth={columnWidth}
                    rowCount={nfts.length}
                    rowHeight={rowHeight}
                    ref={ref}
                    onItemsRendered={onGridItemsRendered}
                  >
                    {({ columnIndex, rowIndex, style }) => {
                      const key: number = rowIndex * columnCount + columnIndex;
                      return !isItemLoaded(key) ? (
                        <SkeletonLoader />
                      ) : (
                        <div key={key} style={style}>
                          <NFTCard nft={nfts[key]} />
                        </div>
                      );
                    }}
                  </FixedSizeGrid>
                );
              }}
            </InfiniteLoader>
          );
        }}
      </AutoSizer>
    </div>
  );
}
