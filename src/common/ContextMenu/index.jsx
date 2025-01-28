import React, { useState, useRef, useEffect } from 'react'
import "./index.css";

/**
 * @typedef {Object} MenuItem
 * @property {String} label label name
 * @property {function} action onClick action of this label
 */

/**
 * @param {Object} props
 * @param {Array<MenuItem>} props.menuItems - an object array containing your right click menu, please see the example
 * @description wrap your component with this then you can right click in your component
 * @example
 * <ContextMenu menuItems={
 *   [
 *     {label: 'Open', action: handleOpen},
 *     {label: 'Edit', action: handleEdit}
 *   ]
 * }>
 *   {children}
 * </ContextMenu>
 * @returns Your component with right click menu
 */
export default function ContextMenu(props) {
  const { children, menuItems, style } = props
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        menuRef.current.classList.remove('context-menu')
        menuRef.current.classList.add('context-menu-hidden')
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleContextMenu = (event) => {
    event.preventDefault();
    const otherMenus = document.querySelectorAll('.context-menu')
    otherMenus.forEach(menu => {
      menu.classList.remove('context-menu')
      menu.classList.add('context-menu-hidden')
    })
    menuRef.current.classList.remove('context-menu-hidden')
    menuRef.current.classList.add('context-menu')

    setXPos(`${event.clientX + 5}px`);
    setYPos(`${event.clientY - 5}px`);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = menuRef.current.clientWidth;
    const h = menuRef.current.clientHeight;

    if (event.clientX > vw - w - 5) {
      setXPos(`${event.clientX - w}px`);
    }

    if (event.clientY > vh - h + 5) {
      setYPos(`${vh - h - 5}px`)
    }

  };

  const handleMenuItemClick = (event, action) => {
    event.preventDefault();
    action();
    menuRef.current.classList.remove('context-menu')
    menuRef.current.classList.add('context-menu-hidden')
  };

  const handleContextMenuClose = () => {
    menuRef.current.classList.remove('context-menu')
    menuRef.current.classList.add('context-menu-hidden')
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>
        {children}
      </div>
      <div
        // className={`context-menu${isVisible ? '' : '-hidden'}`}
        className='context-menu-hidden'
        ref={menuRef}
        style={{ position: 'absolute', top: yPos, left: xPos }}
        onClick={handleContextMenuClose}
      >
        <div className="context-menu-content">
          {menuItems.map((item, index) => (
            <div className='label' key={index} style={style} onClick={(event) => handleMenuItemClick(event, item.action)}>
              {item.label}
            </div>
          ))}
        </div>

      </div>
    </>

  );
}

// ContextMenu.propTypes = {
//   MenuItems: PropTypes.arrayOf(
//     PropTypes.shape({
//       label: PropTypes.string.isRequired,
//       action: PropTypes.func.isRequired
//     })
//   ).isRequired,
//   children: PropTypes.node.isRequired
// }