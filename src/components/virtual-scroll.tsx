"use client";
import { useRef, useState, ReactNode, useEffect } from "react";

export interface VirtualScrollProps {
  offset?: number;
  buffer: number;
  cache: number;
  limit: number;
  rowHeight: number;
  itemWidth: number;
  hasNext?: boolean;
  className?: string;
  prevCallback: (newOffset: number) => Promise<boolean>;
  nextCallback: (newOffset: number) => Promise<boolean>;
  children: ReactNode;
}

export default function VirtualScroll({
  offset = 0,
  hasNext = true,
  buffer,
  cache,
  limit,
  rowHeight,
  itemWidth,
  prevCallback,
  nextCallback,
  className = "",
  children,
}: VirtualScrollProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [upperBoundary, setUpperBoundary] = useState(offset);
  const [lowerBoundary, setLowerBoundary] = useState(cache - 1);
  const [loading, setLoading] = useState(false);
  const [currentScrollTopPosition, setCurrentScrollTopPosition] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(1);
  const [currentIsUp, setCurrentIsUp] = useState(false);

  useEffect(() => {
    if (overlayRef.current) {
      const itemsPerRow = Math.floor(
        overlayRef.current.clientWidth / itemWidth
      );
      setItemsPerRow(itemsPerRow);
    }
  }, [cache, itemWidth]);

  const handleScroll = (target: HTMLDivElement) => {
    if (loading) {
      return;
    }

    const scrollTop = Math.round(target.scrollTop);
    const clientHeight = Math.round(target.clientHeight);
    const scrollHeight = Math.round(target.scrollHeight);
    const isUp = scrollTop < currentScrollTopPosition;
    const changedDirection = isUp !== currentIsUp;
    setCurrentIsUp(isUp);
    if (isUp && scrollTop === 0) {
      if (upperBoundary === 0) {
        return;
      }
      setLoading(true);
      let newUpperBoundary: number;
      if (upperBoundary <= buffer) {
        newUpperBoundary = 0;
      } else {
        newUpperBoundary = changedDirection
          ? upperBoundary - buffer
          : upperBoundary - limit;
      }
      const newLowerBoundary = newUpperBoundary + limit - 1;
      prevCallback(newUpperBoundary).then(() => {
        setUpperBoundary(newUpperBoundary);
        setLowerBoundary(newLowerBoundary);
        console.log(
          `upperBoundary: ${upperBoundary}, lowerBoundary: ${lowerBoundary} scrollTop: ${scrollTop}`
        );
        if (overlayRef !== null && overlayRef.current !== null) {
          const scrollPos = Math.floor(limit / itemsPerRow) * rowHeight;
          overlayRef.current.scrollTo(0, scrollPos);
        }
        setLoading(false);
      });
    } else if (!isUp && scrollTop + clientHeight >= scrollHeight) {
      setLoading(true);

      const newUpperBoundary = changedDirection
        ? limit + lowerBoundary + 1
        : lowerBoundary + 1;
      const newLowerBoundary = newUpperBoundary + limit - 1;

      nextCallback(newUpperBoundary).then(() => {
        setUpperBoundary(newUpperBoundary);
        setLowerBoundary(newLowerBoundary);
        console.log(
          `upperBoundary: ${newUpperBoundary}, lowerBoundary: ${newLowerBoundary}`
        );
        if (overlayRef !== null && overlayRef.current !== null) {
          const scrollPos = Math.ceil(limit / itemsPerRow) * rowHeight;
          overlayRef.current.scrollTo(0, scrollPos * 2);
        }
        setLoading(false);
      });
    }
    setCurrentScrollTopPosition(scrollTop);
  };

  return (
    <div
      className={`mt-4 flex h-screen w-full flex-wrap overflow-y-scroll ${className}`}
      ref={overlayRef}
      onScroll={(e) => handleScroll(e.currentTarget)}
    >
      {children}
    </div>
  );
}
