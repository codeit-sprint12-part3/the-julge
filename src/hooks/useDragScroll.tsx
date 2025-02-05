import { useEffect, useRef, useState } from "react";

const useDragScroll = (tableWrapRef: React.RefObject<HTMLDivElement>) => {
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableWrapRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - tableWrapRef.current.offsetLeft;
    scrollLeft.current = tableWrapRef.current.scrollLeft;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !tableWrapRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableWrapRef.current.offsetLeft;
    const walk = (x - startX.current) * 1; // 스크롤 속도 조절
    tableWrapRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!tableWrapRef.current) return;
    const tableWrap = tableWrapRef.current;

    tableWrap.addEventListener("mousemove", handleMouseMove);
    tableWrap.addEventListener("mouseup", handleMouseUp);
    tableWrap.addEventListener("mouseleave", handleMouseUp);

    return () => {
      tableWrap.removeEventListener("mousemove", handleMouseMove);
      tableWrap.removeEventListener("mouseup", handleMouseUp);
      tableWrap.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDragging]);

  return { handleMouseDown };
};

export default useDragScroll;
