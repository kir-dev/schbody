import React, { useEffect } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type props = {
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  firstLastHide?: boolean;
  prevNextHide?: boolean;
  isLoading?: boolean;
};

const PAGES_PER_PAGE = 50;
const NEIGHBOUR_BTN_NUM = 2;
export default function OwnPagination({ props }: { props: props }) {
  const [buttons, setButtons] = React.useState<number[]>([]);
  const lastPageIndex = Math.ceil(props.limit / PAGES_PER_PAGE) - 1;
  useEffect(() => {
    const buttons = [];
    const lowerBound = props.pageIndex - NEIGHBOUR_BTN_NUM > 0 ? props.pageIndex - NEIGHBOUR_BTN_NUM : 0;
    const upperBound =
      props.pageIndex + NEIGHBOUR_BTN_NUM < lastPageIndex ? props.pageIndex + NEIGHBOUR_BTN_NUM : lastPageIndex;
    for (let i = lowerBound; i <= upperBound; i++) {
      buttons.push(i);
    }
    setButtons(buttons);
  }, [props, lastPageIndex]);
  return (
    <Pagination>
      <PaginationContent>
        {!props.firstLastHide && (
          <PaginationItem
            onClick={() => {
              props.setPageIndex(0);
            }}
            aria-disabled={props.pageIndex <= 0}
            className={props.pageIndex <= 0 ? 'pointer-events-none opacity-50' : ''}
          >
            <PaginationFirst />
          </PaginationItem>
        )}
        {!props.prevNextHide && (
          <PaginationItem
            onClick={() => {
              if (props.pageIndex === 0) return;
              props.setPageIndex(props.pageIndex - 1);
            }}
            aria-disabled={props.pageIndex <= 0}
            className={props.pageIndex <= 0 ? 'pointer-events-none opacity-50' : ''}
          >
            <PaginationPrevious />
          </PaginationItem>
        )}
        {props.isLoading && (
          <>
            {[...Array(5)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink>?</PaginationLink>
              </PaginationItem>
            ))}
          </>
        )}
        {!props.isLoading &&
          buttons.map((button) => (
            <PaginationItem key={button} onClick={() => props.setPageIndex(button)}>
              <PaginationLink isActive={button === props.pageIndex} href='#'>
                {button + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        {!props.prevNextHide && (
          <PaginationItem
            onClick={() => {
              if (props.pageIndex === lastPageIndex) return;
              props.setPageIndex(props.pageIndex + 1);
            }}
            aria-disabled={lastPageIndex <= props.pageIndex}
            className={lastPageIndex <= props.pageIndex ? 'pointer-events-none opacity-50' : ''}
          >
            <PaginationNext />
          </PaginationItem>
        )}
        {!props.firstLastHide && (
          <PaginationItem
            onClick={() => props.setPageIndex(lastPageIndex)}
            aria-disabled={lastPageIndex <= props.pageIndex}
            className={lastPageIndex <= props.pageIndex ? 'pointer-events-none opacity-50' : ''}
          >
            <PaginationLast />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
