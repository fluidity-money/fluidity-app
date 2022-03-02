import {useEffect, useState} from "react"
import {To} from "react-router";
import {HashLink} from "react-router-hash-link";

const SidebarLink = ({to, isActive}: {to: To, isActive: boolean}) => {
    return (
    <HashLink smooth to={to}>
      <button className={`circle-tab${isActive ? " active" : ""}`}/>
    </HashLink>
  )
}

interface View {
  observer: IntersectionObserver,
  isIntersecting: boolean,
}

const Sidebar = () => {
  const links = [
    "left-panel",
    "backers",
    "ido-description",
    "get-involved",
    "end-form",
  ] as const;
  // callback for IntersectionObservers to report whether elements are visiblg
  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    // get the relevant element and check whether it's now intersecting
    const entry = entries[0];
    const {id} = entry.target;
    const {isIntersecting} = entry;
    // update only that property, without removing its observer
    setViews(views => {
      return {
        ...views,
        [id]: {
          ...views[id],
          isIntersecting,
        }
      }
    });
  }


  // k is keyof links, but can't get that to function properly
  const [views, setViews] = useState<{[k: string]: View}>(
    // on load, create the relevant observers
    Object.fromEntries(links.map(link =>
      [link, {
        observer: new IntersectionObserver(onIntersect, {threshold: 0.5}),
        isIntersecting: false,
      }]
    )));

  // begin observing
  useEffect(() => {
    links.forEach((link) => {
      const targetElement = document.getElementById(link);
      if (targetElement) {
        const {observer} = views[link];
        observer.observe(targetElement)
        }
    })
  }, []);

  return (
    <div className="sidebar">
      {links.map((link, i) => {
        // active if that observer reports intersecting, and the previous observer isn't also active
        // (we want the topmost visible section to be active)
        const isActive = views[link]?.isIntersecting && (i === 0 || !views[links[i - 1]].isIntersecting)
        return <SidebarLink
          key={link}
          to={`/#${link}`}
          isActive={isActive}
        />
      })}
    </div>
  )
}

export default Sidebar;
