export const enableScrollLock = () => {
  const { body } = document;
  if (!body.getAttribute("scrollY")) {
    const pageY = window.pageYOffset;
    body.setAttribute("scrollY", pageY.toString());
    const hasScroll = document.documentElement.scrollHeight > window.innerHeight;
    body.style.overflowY = hasScroll ? "scroll" : "hidden";
    body.style.position = "fixed";
    body.style.left = "0px";
    body.style.right = "0px";
    body.style.bottom = "0px";
    body.style.top = `-${pageY}px`;
  }
};

export const disableScrollLock = () => {
  const { body } = document;
  if (body.getAttribute("scrollY")) {
    body.style.removeProperty("overflowY");
    body.style.removeProperty("position");
    body.style.removeProperty("top");
    body.style.removeProperty("left");
    body.style.removeProperty("right");
    body.style.removeProperty("bottom");
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      body.style.overflowY = "hidden";
    }
    window.scrollTo(0, Number(body.getAttribute("scrollY")));
    body.removeAttribute("scrollY");
  }
};
